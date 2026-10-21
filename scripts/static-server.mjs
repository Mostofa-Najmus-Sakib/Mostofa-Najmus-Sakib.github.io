import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve, sep } from 'node:path';

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.pdf', 'application/pdf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

export function createStaticServer({ rootDir, basePath = '/' }) {
  const root = resolve(rootDir);
  const base = `/${basePath.split('/').filter(Boolean).join('/')}`;
  const prefix = base === '/' ? '/' : `${base}/`;

  return createServer(async (request, response) => {
    const fail = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(message);
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      fail(405, 'Method not allowed');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      fail(400, 'Bad request');
      return;
    }

    if (base !== '/' && pathname === base) {
      response.writeHead(308, { Location: prefix });
      response.end();
      return;
    }

    if (!pathname.startsWith(prefix)) {
      fail(404, 'Not found');
      return;
    }

    const route = pathname.slice(prefix.length) || 'index.html';
    const parts = route.split('/');
    // Only public site files are served. Never expose Git metadata, tooling,
    // dependency files, directory listings, or paths outside the site assets.
    if (
      route.includes('\\') || route.includes('\0') ||
      parts.some((part) => !part || part.startsWith('.')) ||
      !(route === 'index.html' || route.startsWith('assets/'))
    ) {
      fail(404, 'Not found');
      return;
    }

    try {
      const file = await realpath(join(root, route));
      const allowed = route === 'index.html' ? root : join(root, 'assets');
      const within = relative(allowed, file);
      if (within === '..' || within.startsWith(`..${sep}`) || resolve(allowed, within) !== file) {
        fail(404, 'Not found');
        return;
      }
      const info = await stat(file);
      if (!info.isFile()) {
        fail(404, 'Not found');
        return;
      }

      response.writeHead(200, {
        'Content-Type': types.get(extname(file).toLowerCase()) || 'application/octet-stream',
        'Content-Length': info.size,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      if (request.method === 'HEAD') {
        response.end();
        return;
      }
      const stream = createReadStream(file);
      stream.on('error', () => response.destroy());
      stream.pipe(response);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR', 'EACCES', 'ELOOP'].includes(error.code)) {
        fail(404, 'Not found');
      } else {
        console.error('Unable to serve requested site file:', error.code || error.message);
        fail(500, 'Internal server error');
      }
    }
  });
}
