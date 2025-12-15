import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [
		tailwindcss(),
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				// Vite 8 + Rolldown 使用 advancedChunks 替代 manualChunks
				advancedChunks: {
					groups: [
						// React 核心库 - 版本稳定，长期缓存
						{
							name: 'vendor-react',
							test: /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//,
						},
						// Ant Design 相关 - 更新较频繁
						{
							name: 'vendor-antd',
							test: /node_modules\/(@ant-design|antd)\//,
						},
						// 其他工具库 - 变化最少
						{
							name: 'vendor-utils',
							test: /node_modules/,
						},
						// 系统级别组件和工具
						{
							name: 'system',
							test: /\/src\/(components\/system|store|layouts|locales|config|utils)\//,
						},
						// 页面级别拆分 - 自动按目录名拆分
						{
							name: (moduleId: string) => {
								const match = moduleId.match(/\/src\/pages\/([^/]+)\//);
								return match ? `page-${match[1]}` : undefined;
							},
							test: /\/src\/pages\//,
						},
					],
				},
			},
		},
	},
});
