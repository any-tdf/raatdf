import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		arrowParens: 'always',
		bracketSameLine: false,
		bracketSpacing: true,
		endOfLine: 'lf',
		ignorePatterns: ['.astro/**', 'dist/**', 'node_modules/**', 'public/**'],
		printWidth: 120,
		quoteProps: 'as-needed',
		semi: true,
		singleQuote: true,
		sortImports: true,
		sortPackageJson: false,
		tabWidth: 2,
		trailingComma: 'es5',
		useTabs: true,
	},
	lint: {
		ignorePatterns: ['.astro/**', 'dist/**', 'node_modules/**', 'public/**'],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
		options: { typeAware: true, typeCheck: true },
	},
});
