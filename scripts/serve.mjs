import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createStaticServer } from './static-server.mjs';

const { values } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string' },
    base: { type: 'string', default: '/' },
    preview: { type: 'boolean', default: false },
  },
});

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(values.port ?? (values.preview ? 4173 : 5173));
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error('--port must be an integer from 0 through 65535.');
}

const server = createStaticServer({
  rootDir: values.preview ? resolve(root, 'dist') : root,
  basePath: values.base,
});

server.on('error', (error) => {
  console.error(`Unable to start the site server: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, values.host, () => {
  console.log(`Portfolio server listening on ${values.host}:${server.address().port}${values.base}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
