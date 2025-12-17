import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 复制目录的辅助函数
function copyDir(src, dest) {
	if (!existsSync(dest)) {
		mkdirSync(dest, { recursive: true });
	}
	const entries = readdirSync(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = join(src, entry.name);
		const destPath = join(dest, entry.name);
		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			copyFileSync(srcPath, destPath);
		}
	}
}

// 构建后钩子 - 复制文档文件
function copyDocsPlugin() {
	return {
		name: 'copy-docs',
		writeBundle() {
			const outDir = resolve(__dirname, 'dist');
			const readmeDir = resolve(__dirname, '../readme');
			const mdDir = resolve(__dirname, 'md');

			// 复制 readme/ 目录到 dist/readme/
			if (existsSync(readmeDir)) {
				const destDir = join(outDir, 'readme');
				if (!existsSync(destDir)) {
					mkdirSync(destDir, { recursive: true });
				}
				readdirSync(readmeDir).forEach((file) => {
					const srcPath = join(readmeDir, file);
					const destPath = join(destDir, file);
					copyFileSync(srcPath, destPath);
				});
			}

			// 复制 md/ 目录到 dist/md/
			if (existsSync(mdDir)) {
				copyDir(mdDir, join(outDir, 'md'));
			}

			console.log('✅ 文档文件已复制到 dist 目录');
		},
	};
}

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
		copyDocsPlugin(),
	],
});
