import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';
import 'highlight.js/styles/atom-one-dark.css';

// 注册语言
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('javascript', javascript as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('js', javascript as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('typescript', typescript as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('ts', typescript as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('tsx', typescript as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('bash', bash as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('shell', bash as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('json', json as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('html', html as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('xml', html as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('css', css as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('python', python as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('java', java as any);
// biome-ignore lint/suspicious/noExplicitAny: highlight.js 语言定义类型兼容性问题
hljs.registerLanguage('sql', sql as any);

// 自定义 renderer 为标题添加 id 并处理代码块高亮
const renderer = new marked.Renderer();

// 生成标题 ID 的统一函数
function generateId(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格和连字符
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
	const id = generateId(text);
	return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

// 重写代码块渲染
renderer.codespan = (token: { text: string }) => `<code>${token.text}</code>`;

renderer.code = (token: { text: string; lang?: string }) => {
	const lang = token.lang || 'plaintext';
	let highlighted = token.text;

	if (hljs.getLanguage(lang)) {
		try {
			highlighted = hljs.highlight(token.text, { language: lang }).value;
		} catch (err) {
			console.error('Highlight error:', err);
		}
	}

	return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>\n`;
};

// Markdown 解析配置
marked.setOptions({
	breaks: true,
	gfm: true,
	renderer: renderer,
});

interface TocItem {
	level: number;
	text: string;
	id: string;
}

interface Doc {
	name: string;
	file: string;
}

type DocKey = 'overview' | 'guide' | 'changelog' | 'faq';
type Lang = 'zh_CN' | 'en_US';

// 多语言配置
const i18n: Record<
	Lang,
	{
		title: string;
		pageTitle: string;
		toc: string;
		loading: string;
		loadError: string;
		openToc: string;
		closeToc: string;
		openNav: string;
		closeNav: string;
		docNav: string;
		docs: Record<DocKey, Doc>;
	}
> = {
	zh_CN: {
		title: '文档',
		pageTitle: 'RAATDF - 项目文档',
		toc: '目录',
		loading: '加载中...',
		loadError: '# 加载文档失败\n\n请检查网络连接或文件路径。',
		openToc: '打开目录',
		closeToc: '关闭目录',
		openNav: '打开菜单',
		closeNav: '关闭导航',
		docNav: '文档导航',
		docs: {
			overview: { name: '项目介绍', file: '/readme/README_zh_CN.md' },
			guide: { name: '开发指南', file: '/md/zh_CN/guide.md' },
			changelog: { name: '更新日志', file: '/md/zh_CN/changelog.md' },
			faq: { name: '常见问题', file: '/md/zh_CN/faq.md' },
		},
	},
	en_US: {
		title: 'Docs',
		pageTitle: 'RAATDF - Documentation',
		toc: 'Contents',
		loading: 'Loading...',
		loadError: '# Failed to load document\n\nPlease check network connection or file path.',
		openToc: 'Open contents',
		closeToc: 'Close contents',
		openNav: 'Open menu',
		closeNav: 'Close navigation',
		docNav: 'Navigation',
		docs: {
			overview: { name: 'Overview', file: '/README.md' },
			guide: { name: 'Guide', file: '/md/en_US/guide.md' },
			changelog: { name: 'Changelog', file: '/md/en_US/changelog.md' },
			faq: { name: 'FAQ', file: '/md/en_US/faq.md' },
		},
	},
};

// 应用状态
class App {
	private currentLang: Lang = 'zh_CN';
	private currentDoc: DocKey = 'overview';
	private tocItems: TocItem[] = [];
	private activeId = '';
	private mainElement: HTMLElement | null = null;
	private contentElement: HTMLElement | null = null;
	private isNavOpen = false;
	private isTocOpen = false;

	private get t() {
		return i18n[this.currentLang];
	}

	private get docs() {
		return this.t.docs;
	}

	constructor() {
		this.init();
	}

	private init() {
		this.currentLang = this.getInitialLang();
		this.currentDoc = this.getInitialDoc();
		this.updatePageTitle();
		this.render();
		this.mainElement = document.getElementById('main-content');
		this.contentElement = document.getElementById('markdown-content');

		this.loadDoc();
		this.setupScrollListener();
		this.setupHashListener();
	}

	private updatePageTitle() {
		document.title = this.t.pageTitle;
	}

	private getInitialLang(): Lang {
		const params = new URLSearchParams(window.location.search);
		const langParam = params.get('lang') as Lang | null;
		if (langParam && (langParam === 'zh_CN' || langParam === 'en_US')) {
			return langParam;
		}
		// 检测浏览器语言
		const browserLang = navigator.language.toLowerCase();
		return browserLang.startsWith('zh') ? 'zh_CN' : 'en_US';
	}

	private getInitialDoc(): DocKey {
		const params = new URLSearchParams(window.location.search);
		const docParam = params.get('doc') as DocKey | null;
		return docParam && docParam in this.docs ? docParam : 'overview';
	}

	private render() {
		const app = document.getElementById('app');
		if (!app) return;

		app.innerHTML = `
      <div class="flex flex-col h-screen bg-white dark:bg-gray-950">
        <!-- 顶部导航栏 -->
        <header class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div class="px-4 md:px-6 py-4">
            <div class="flex items-center justify-between">
              <!-- 左侧：目录按钮（仅移动端） -->
              <div class="flex items-center gap-2">
                <!-- 移动端目录按钮 -->
                <button
                  type="button"
                  id="toc-toggle"
                  class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="${this.t.openToc}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                  </svg>
                </button>

                <!-- 桌面端 Logo + 标题 -->
                <div class="hidden md:flex items-center gap-2">
                  <img src="/logo.png" alt="RAATDF Logo" class="h-6 w-6 object-contain" />
                  <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">${this.t.title}</h1>
                </div>
              </div>

              <!-- 中间：Logo（仅移动端） -->
              <div class="md:hidden flex-1 text-center px-4">
                <img src="/logo.png" alt="RAATDF" class="h-6 w-6 inline-block object-contain" />
              </div>

              <!-- 右侧：桌面端导航 + 语言切换 / 移动端导航按钮 -->
              <div class="flex items-center gap-2">
                <!-- 桌面端导航 -->
                <nav class="hidden md:flex gap-1" id="doc-nav">
                  ${Object.entries(this.docs)
										.map(
											([key, doc]) => `
                    <button
                      type="button"
                      data-doc="${key}"
                      class="doc-nav-btn px-4 py-2 rounded-lg font-medium transition-colors ${
												this.currentDoc === key
													? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
													: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
											}"
                    >
                      ${doc.name}
                    </button>
                  `
										)
										.join('')}
                </nav>

                <!-- 语言切换按钮 -->
                <button
                  type="button"
                  id="lang-toggle"
                  class="hidden md:flex p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Switch language"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                  </svg>
                </button>

                <!-- GitHub 链接 -->
                <a
                  href="https://github.com/any-tdf/raatdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hidden md:flex p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="GitHub"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"/>
                  </svg>
                </a>

                <!-- 移动端导航菜单按钮 -->
                <button
                  type="button"
                  id="nav-toggle"
                  class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="${this.t.openNav}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div class="flex flex-1 overflow-hidden relative">
          <!-- 左侧目录侧边栏 -->
          <aside id="toc-sidebar" class="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto
            md:block
            fixed md:static inset-y-0 left-0 z-40
            transition-transform duration-300 ease-in-out
            -translate-x-full md:translate-x-0"
            style="top: 64px;"
          >
            <div class="p-4">
              <!-- 移动端关闭按钮 -->
              <div class="flex md:hidden items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">${this.t.toc}</h2>
                <button
                  type="button"
                  id="toc-close"
                  class="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  aria-label="${this.t.closeToc}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div id="toc-container"></div>
            </div>
          </aside>

          <!-- 右侧导航菜单侧边栏（仅移动端） -->
          <aside id="nav-sidebar" class="w-64 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto
            md:hidden
            fixed inset-y-0 right-0 z-40
            transform transition-transform duration-300 ease-in-out
            translate-x-full"
            style="top: 64px;"
          >
            <div class="p-4">
              <!-- 移动端关闭按钮 -->
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">${this.t.docNav}</h2>
                <button
                  type="button"
                  id="nav-close"
                  class="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  aria-label="${this.t.closeNav}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- 移动端导航菜单 -->
              <nav class="space-y-1">
                ${Object.entries(this.docs)
									.map(
										([key, doc]) => `
                  <button
                    type="button"
                    data-doc="${key}"
                    class="mobile-nav-btn w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
											this.currentDoc === key
												? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
												: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
										}"
                  >
                    ${doc.name}
                  </button>
                `
									)
									.join('')}
              </nav>

              <!-- 分割线 -->
              <div class="my-3 border-t border-gray-200 dark:border-gray-700"></div>

              <!-- 移动端功能按钮 -->
              <div class="space-y-1">
                <!-- 语言切换 -->
                <button
                  type="button"
                  id="mobile-lang-toggle"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                  </svg>
                  <span>${this.currentLang === 'zh_CN' ? 'English' : '简体中文'}</span>
                </button>

                <!-- GitHub 链接 -->
                <a
                  href="https://github.com/any-tdf/raatdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </aside>

          <!-- 遮罩层（仅移动端） -->
          <div
            id="overlay"
            class="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 md:hidden transition-opacity duration-300 opacity-0 pointer-events-none"
            style="top: 64px;"
          ></div>

          <!-- 右侧主内容区域 -->
          <main id="main-content" class="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            <div class="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
              <div id="loading" class="text-center py-12 hidden">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100"></div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">${this.t.loading}</p>
              </div>
              <div
                id="markdown-content"
                class="prose dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:mt-0 prose-h1:mb-4 md:prose-h1:mb-6
                prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 md:prose-h2:mt-10 prose-h2:mb-3 md:prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800 prose-h2:pb-2
                prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-2 md:prose-h3:mb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
                prose-a:text-gray-900 dark:prose-a:text-gray-100 prose-a:underline hover:prose-a:no-underline
                prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-900 prose-pre:p-3 md:prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-sm
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1 prose-li:text-sm md:prose-li:text-base
                prose-table:border-collapse prose-table:w-full prose-table:text-sm md:prose-table:text-base
                prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:font-semibold prose-th:text-left prose-th:p-2 md:prose-th:p-3 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700
                prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:p-2 md:prose-td:p-3 prose-td:text-gray-700 dark:prose-td:text-gray-300
                [&_pre_code]:text-sm [&_pre_code]:text-gray-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
              ></div>
            </div>
          </main>
        </div>
      </div>
    `;

		// 绑定桌面端导航按钮事件
		const navButtons = document.querySelectorAll('.doc-nav-btn');
		navButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				const docKey = (e.target as HTMLElement).dataset.doc as DocKey;
				this.switchDoc(docKey);
			});
		});

		// 绑定移动端导航按钮事件
		const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
		mobileNavButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				const docKey = (e.target as HTMLElement).dataset.doc as DocKey;
				this.switchDoc(docKey);
				this.toggleNav(); // 切换后关闭菜单
			});
		});

		// 绑定移动端切换按钮
		const navToggle = document.getElementById('nav-toggle');
		const tocToggle = document.getElementById('toc-toggle');
		const tocClose = document.getElementById('toc-close');
		const navClose = document.getElementById('nav-close');
		const overlay = document.getElementById('overlay');
		const langToggle = document.getElementById('lang-toggle');
		const mobileLangToggle = document.getElementById('mobile-lang-toggle');

		navToggle?.addEventListener('click', () => this.toggleNav());
		tocToggle?.addEventListener('click', () => this.toggleToc());
		tocClose?.addEventListener('click', () => this.toggleToc());
		navClose?.addEventListener('click', () => this.toggleNav());
		overlay?.addEventListener('click', () => {
			if (this.isTocOpen) this.toggleToc();
			if (this.isNavOpen) this.toggleNav();
		});
		langToggle?.addEventListener('click', () => this.switchLang());
		mobileLangToggle?.addEventListener('click', () => this.switchLang());
	}

	private async loadDoc() {
		const loading = document.getElementById('loading');
		const content = this.contentElement;

		if (loading) loading.classList.remove('hidden');
		if (content) content.innerHTML = '';

		try {
			const response = await fetch(this.docs[this.currentDoc].file);
			const text = await response.text();

			// 提取标题用于目录（排除代码块中的内容）
			const textWithoutCodeBlocks = text.replace(/```[\s\S]*?```/g, ''); // 移除代码块
			const headings = textWithoutCodeBlocks.match(/^#{1,3}\s.+$/gm) || [];
			this.tocItems = headings.map((heading) => {
				const level = (heading.match(/^#+/) || [''])[0].length;
				const headingText = heading.replace(/^#+\s/, '');
				const id = generateId(headingText);
				return { level, text: headingText, id };
			});

			this.activeId = this.tocItems[0]?.id || '';

			// 渲染内容
			const htmlContent = marked(text) as string;
			if (content) {
				content.innerHTML = htmlContent;
			}

			// 渲染目录
			this.renderToc();

			// 滚动到顶部
			if (this.mainElement) {
				this.mainElement.scrollTop = 0;
			}

			// 处理 URL hash
			this.handleHash();
		} catch (_err) {
			if (content) {
				content.innerHTML = marked(this.t.loadError) as string;
			}
		} finally {
			if (loading) loading.classList.add('hidden');
		}
	}

	private renderToc() {
		const container = document.getElementById('toc-container');
		if (!container || this.tocItems.length === 0) return;

		// 只显示一级标题
		const h1Items = this.tocItems.filter((item) => item.level === 1);

		container.innerHTML = `
      <h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
        ${this.t.toc}
      </h2>
      <nav class="space-y-0.5 text-sm" id="toc-nav">
        ${h1Items
					.map(
						(item) => `
          <a
            href="#${item.id}"
            data-id="${item.id}"
            class="toc-item block transition-colors py-1.5 rounded border-l-2 ${
							this.activeId === item.id
								? 'border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
								: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
						}"
            style="padding-left: 12px"
          >
            ${item.text}
          </a>
        `
					)
					.join('')}
      </nav>
    `;

		// 绑定目录点击事件
		const tocLinks = container.querySelectorAll('.toc-item');
		tocLinks.forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const id = (e.target as HTMLElement).dataset.id || '';
				this.scrollToHeading(id);
			});
		});
	}

	private scrollToHeading(id: string) {
		const element = document.getElementById(id);
		if (element && this.mainElement) {
			const mainRect = this.mainElement.getBoundingClientRect();
			const elementRect = element.getBoundingClientRect();
			const scrollTop = this.mainElement.scrollTop;
			const targetScroll = scrollTop + (elementRect.top - mainRect.top) - 20;

			this.mainElement.scrollTo({
				top: targetScroll,
				behavior: 'smooth',
			});

			this.updateActiveId(id);
		}
	}

	private updateActiveId(id: string) {
		this.activeId = id;
		window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);

		// 更新目录样式
		const tocLinks = document.querySelectorAll('.toc-item');
		tocLinks.forEach((link) => {
			const linkId = (link as HTMLElement).dataset.id;
			if (linkId === id) {
				link.className =
					'toc-item block transition-colors py-1.5 rounded border-l-2 border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium';
			} else {
				link.className =
					'toc-item block transition-colors py-1.5 rounded border-l-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800';
			}
		});
	}

	private setupScrollListener() {
		let ticking = false;

		const handleScroll = () => {
			if (!this.mainElement) return;

			const headings = this.mainElement.querySelectorAll('h1, h2, h3');
			const mainRect = this.mainElement.getBoundingClientRect();
			let currentActive = '';

			for (const heading of headings) {
				const rect = heading.getBoundingClientRect();
				const relativeTop = rect.top - mainRect.top;

				if (relativeTop <= 120) {
					currentActive = heading.id;
				}
			}

			if (currentActive && currentActive !== this.activeId) {
				this.updateActiveId(currentActive);
			}

			ticking = false;
		};

		this.mainElement?.addEventListener('scroll', () => {
			if (!ticking) {
				requestAnimationFrame(handleScroll);
				ticking = true;
			}
		});
	}

	private setupHashListener() {
		window.addEventListener('hashchange', () => {
			this.handleHash();
		});
	}

	private handleHash() {
		let hash = window.location.hash.slice(1);
		if (hash) {
			try {
				hash = decodeURIComponent(hash);
			} catch (_e) {
				// 如果解码失败，使用原始 hash
			}

			setTimeout(() => {
				this.scrollToHeading(hash);
			}, 200);
		}
	}

	private updateUrl() {
		const params = new URLSearchParams();
		params.set('lang', this.currentLang);
		params.set('doc', this.currentDoc);
		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState(null, '', newUrl);
	}

	private switchLang() {
		this.currentLang = this.currentLang === 'zh_CN' ? 'en_US' : 'zh_CN';
		this.updateUrl();
		this.updatePageTitle();
		// 重新渲染整个页面以更新所有文本
		this.render();
		this.mainElement = document.getElementById('main-content');
		this.contentElement = document.getElementById('markdown-content');
		this.loadDoc();
		this.setupScrollListener();
	}

	private switchDoc(docKey: DocKey) {
		this.currentDoc = docKey;
		this.updateUrl();

		// 更新桌面端导航按钮样式
		const navButtons = document.querySelectorAll('.doc-nav-btn');
		navButtons.forEach((btn) => {
			const key = (btn as HTMLElement).dataset.doc;
			if (key === docKey) {
				btn.className =
					'doc-nav-btn px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
			} else {
				btn.className =
					'doc-nav-btn px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800';
			}
		});

		// 更新移动端导航按钮样式
		const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
		mobileNavButtons.forEach((btn) => {
			const key = (btn as HTMLElement).dataset.doc;
			if (key === docKey) {
				btn.className =
					'mobile-nav-btn w-full text-left px-4 py-3 rounded-lg font-medium transition-colors bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
			} else {
				btn.className =
					'mobile-nav-btn w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800';
			}
		});

		this.loadDoc();
	}

	private toggleNav() {
		this.isNavOpen = !this.isNavOpen;
		const navSidebar = document.getElementById('nav-sidebar');
		const overlay = document.getElementById('overlay');

		if (navSidebar && overlay) {
			if (this.isNavOpen) {
				// 打开导航
				navSidebar.classList.remove('translate-x-full');
				navSidebar.classList.add('translate-x-0');
				overlay.classList.remove('opacity-0', 'pointer-events-none');
				overlay.classList.add('opacity-100', 'pointer-events-auto');
				// 禁止背景滚动
				document.body.style.overflow = 'hidden';
			} else {
				// 关闭导航
				navSidebar.classList.add('translate-x-full');
				navSidebar.classList.remove('translate-x-0');
				overlay.classList.add('opacity-0', 'pointer-events-none');
				overlay.classList.remove('opacity-100', 'pointer-events-auto');
				// 恢复背景滚动
				document.body.style.overflow = '';
			}
		}
	}

	private toggleToc() {
		this.isTocOpen = !this.isTocOpen;
		const tocSidebar = document.getElementById('toc-sidebar');
		const overlay = document.getElementById('overlay');

		if (tocSidebar && overlay) {
			if (this.isTocOpen) {
				// 打开目录
				tocSidebar.classList.remove('-translate-x-full');
				tocSidebar.classList.add('translate-x-0');
				overlay.classList.remove('opacity-0', 'pointer-events-none');
				overlay.classList.add('opacity-100', 'pointer-events-auto');
				// 禁止背景滚动
				document.body.style.overflow = 'hidden';
			} else {
				// 关闭目录
				tocSidebar.classList.add('-translate-x-full');
				tocSidebar.classList.remove('translate-x-0');
				overlay.classList.add('opacity-0', 'pointer-events-none');
				overlay.classList.remove('opacity-100', 'pointer-events-auto');
				// 恢复背景滚动
				document.body.style.overflow = '';
			}
		}
	}
}

// 初始化应用
new App();
