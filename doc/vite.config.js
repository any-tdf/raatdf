import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		{
			name: 'serve-parent-files',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					// 处理 README.md 请求
					if (req.url === '/README.md') {
						try {
							const content = readFileSync(resolve(__dirname, '../README.md'), 'utf-8');
							res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
							res.end(content);
							return;
						} catch (err) {
							console.error('Error reading README.md:', err);
						}
					}
					// 处理 readme 目录下的文件请求
					if (req.url?.startsWith('/readme/')) {
						try {
							const filePath = req.url.replace('/readme/', '');
							const content = readFileSync(resolve(__dirname, '../readme', filePath), 'utf-8');
							res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
							res.end(content);
							return;
						} catch (err) {
							console.error('Error reading file from readme:', err);
						}
					}
					next();
				});
			},
		},
	],
});
