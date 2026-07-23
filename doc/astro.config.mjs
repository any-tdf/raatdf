import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://doc.raatdf.com',
	server: {
		host: 'localhost',
		port: 4321,
	},
	vite: {
		server: {
			strictPort: true,
		},
	},
	integrations: [
		starlight({
			title: {
				'zh-CN': 'RAATDF 文档',
				en: 'RAATDF Docs',
			},
			description: 'Documentation for the RAATDF enterprise React admin template.',
			logo: {
				src: './src/assets/logo.png',
				alt: 'RAATDF',
			},
			favicon: '/logo.png',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/any-tdf/raatdf',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/any-tdf/raatdf/edit/main/doc/',
			},
			customCss: ['./src/styles/custom.css'],
			lastUpdated: true,
			credits: true,
			sidebar: [
				{
					label: '文档导航',
					translations: { en: 'Documentation' },
					items: [
						{ label: '项目概览', translations: { en: 'Overview' }, link: '/' },
						{ label: '开发指南', translations: { en: 'Guide' }, link: '/guide/' },
						{ label: '升级说明', translations: { en: 'Upgrade notes' }, link: '/upgrade/' },
						{ label: '更新日志', translations: { en: 'Changelog' }, link: '/changelog/' },
						{ label: '常见问题', translations: { en: 'FAQ' }, link: '/faq/' },
					],
				},
			],
		}),
	],
});
