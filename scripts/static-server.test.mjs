import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { createStaticServer } from './static-server.mjs';

let directory;
let server;
let origin;

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'portfolio-server-'));
  const root = join(directory, 'site');
  await mkdir(join(root, 'assets'), { recursive: true });
  await mkdir(join(root, '.git'));
  await writeFile(join(root, 'index.html'), '<h1>Portfolio fixture</h1>');
  await writeFile(join(root, 'assets', 'style.css'), 'body { color: #222; }');
  await writeFile(join(root, 'assets', 'resume.pdf'), '%PDF-1.4\n');
  await writeFile(join(root, '.git', 'config'), 'private metadata');
  await writeFile(join(root, 'package.json'), '{}');
  await writeFile(join(directory, 'outside.txt'), 'private outside file');
  await symlink(join(directory, 'outside.txt'), join(root, 'assets', 'escape.txt'));
  server = createStaticServer({ rootDir: root, basePath: '/Personal_Profile' });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (directory) await rm(directory, { recursive: true, force: true });
});

test('serves the site and assets under a GitHub Pages project path', async () => {
  const page = await fetch(`${origin}/Personal_Profile/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /^text\/html/);
  assert.match(await page.text(), /Portfolio fixture/);
  const css = await fetch(`${origin}/Personal_Profile/assets/style.css`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get('content-type'), /^text\/css/);
  const pdf = await fetch(`${origin}/Personal_Profile/assets/resume.pdf`, { method: 'HEAD' });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get('content-type'), 'application/pdf');
  assert.equal(await pdf.text(), '');
});

test('redirects the mount path to preserve relative asset URLs', async () => {
  const result = await fetch(`${origin}/Personal_Profile`, { redirect: 'manual' });
  assert.equal(result.status, 308);
  assert.equal(result.headers.get('location'), '/Personal_Profile/');
});

test('hides private files, directory listings, and paths outside the site', async () => {
  for (const path of [
    '/Personal_Profile/.git/config',
    '/Personal_Profile/package.json',
    '/Personal_Profile/assets/',
    '/Personal_Profile/assets/escape.txt',
    '/Personal_Profile/assets/%2e%2e/.git/config',
    '/Personal_Profile/assets/%2e%2e%2f%2e%2e%2foutside.txt',
    '/Personal_Profile/assets/%5c..%5c.git%5cconfig',
    '/assets/style.css',
  ]) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(await response.text(), /private/);
  }
});

test('rejects malformed paths and state-changing methods', async () => {
  const malformed = await fetch(`${origin}/Personal_Profile/assets/%GG`);
  assert.equal(malformed.status, 400);
  const post = await fetch(`${origin}/Personal_Profile/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});
