/**
 * 错误页面多语言配置
 */

import type { Locale } from '@/locales/system/types';

interface ErrorsLocale {
	forbidden: {
		title: string;
		subTitle: string;
		description: string;
	};
	notFound: {
		title: string;
		subTitle: string;
	};
	serverError: {
		title: string;
		subTitle: string;
		description: string;
	};
	buttons: {
		goBack: string;
		goHome: string;
		contactAdmin: string;
		refresh: string;
	};
}

const zhCN: ErrorsLocale = {
	forbidden: {
		title: '403',
		subTitle: '抱歉，您没有权限访问此页面',
		description: '您可能需要联系管理员获取相应权限，或者返回安全的页面。',
	},
	notFound: {
		title: '404',
		subTitle: '抱歉，您访问的页面不存在',
	},
	serverError: {
		title: '500',
		subTitle: '抱歉，服务器出错了',
		description: '服务器遇到了一个错误，无法完成您的请求。请稍后再试或联系技术支持。',
	},
	buttons: {
		goBack: '返回上一页',
		goHome: '返回首页',
		contactAdmin: '联系管理员',
		refresh: '刷新页面',
	},
};

const enUS: ErrorsLocale = {
	forbidden: {
		title: '403',
		subTitle: "Sorry, you don't have permission to access this page",
		description: 'You may need to contact the administrator for access, or return to a safe page.',
	},
	notFound: {
		title: '404',
		subTitle: 'Sorry, the page you visited does not exist',
	},
	serverError: {
		title: '500',
		subTitle: 'Sorry, something went wrong',
		description:
			'The server encountered an error and could not complete your request. Please try again later or contact support.',
	},
	buttons: {
		goBack: 'Go Back',
		goHome: 'Go Home',
		contactAdmin: 'Contact Admin',
		refresh: 'Refresh',
	},
};

const locales: Record<Locale, ErrorsLocale> = {
	'zh-CN': zhCN,
	'en-US': enUS,
};

export const getErrorsLocale = (locale: Locale): ErrorsLocale => {
	return locales[locale] || zhCN;
};

export default locales;
