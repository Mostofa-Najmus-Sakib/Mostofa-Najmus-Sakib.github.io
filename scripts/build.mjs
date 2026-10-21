import { cp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');

// Validate the inputs before replacing a previous generated build.
if (!(await stat(join(root, 'index.html'))).isFile()) {
  throw new Error('The site needs an index.html file.');
}
if (!(await stat(join(root, 'assets'))).isDirectory()) {
  throw new Error('The site needs an assets directory.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, 'index.html'), join(output, 'index.html'));
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });
await writeFile(join(output, '.nojekyll'), '');

console.log('Built static website in dist/.');
