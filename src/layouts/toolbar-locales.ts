import type { Locale } from '@/locales/system/types';

const toolbarLocales = {
	'zh-CN': {
		notification: {
			title: '通知中心',
			empty: '暂无通知消息',
			unreadCount: '条未读',
			markAllRead: '全部已读',
			clear: '清空',
		},
		chat: {
			title: '聊天',
			developing: '聊天功能开发中...',
			close: '关闭',
		},
		buttonLabels: {
			notification: '通知中心',
			chat: '聊天窗口',
		},
	},
	'en-US': {
		notification: {
			title: 'Notification Center',
			empty: 'No notifications',
			unreadCount: 'unread',
			markAllRead: 'Mark all read',
			clear: 'Clear',
		},
		chat: {
			title: 'Chat',
			developing: 'Chat feature is under development...',
			close: 'Close',
		},
		buttonLabels: {
			notification: 'Notifications',
			chat: 'Chat Box',
		},
	},
} as const;

export const getToolbarLocale = (locale: Locale) => toolbarLocales[locale];

export const getToolbarButtonLabel = (labelKey: string, locale: Locale): string => {
	const labels = toolbarLocales[locale].buttonLabels;
	return labels[labelKey as keyof typeof labels] ?? labelKey;
};
