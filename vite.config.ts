import path from 'node:path';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

// https://vite.dev/config/
export default defineConfig({
	fmt: {
		arrowParens: 'always',
		bracketSameLine: false,
		bracketSpacing: true,
		endOfLine: 'lf',
		ignorePatterns: [
			'doc/**',
			'dist/**',
			'node_modules/**',
			'public/**',
			'coverage/**',
			'.cache/**',
			'.next/**',
			'.nuxt/**',
			'.output/**',
			'.turbo/**',
			'.vite/**',
		],
		printWidth: 120,
		quoteProps: 'as-needed',
		semi: true,
		singleQuote: true,
		sortImports: true,
		sortPackageJson: false,
		sortTailwindcss: {
			stylesheet: './src/app.css',
		},
		tabWidth: 2,
		trailingComma: 'es5',
		useTabs: true,
	},
	lint: {
		ignorePatterns: ['doc/**', 'dist/**', 'node_modules/**', 'public/**', 'coverage/**'],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
		options: { typeAware: true, typeCheck: true },
	},
	test: {
		restoreMocks: true,
		setupFiles: ['./src/test/setup.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [tailwindcss(), react(), babel({ presets: [reactCompilerPreset()] })],
	build: {
		rollupOptions: {
			output: {
				// Vite Plus 使用 Rolldown 的 codeSplitting 配置手动分包
				codeSplitting: {
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
