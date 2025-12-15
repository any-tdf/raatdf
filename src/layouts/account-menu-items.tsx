/**
 * 账号菜单扩展配置
 *
 * 在此文件中配置账号菜单的所有菜单项
 * 最后一项（退出登录）是固定的，不需要在此配置
 * 其他菜单项将按数组顺序显示在退出登录之前
 */

import type { MenuProps } from 'antd';
import type { Locale } from '@/locales';

// ==================== 类型定义 ====================

/**
 * 通用国际化文本接口
 */
export interface CommonLocale {
	accountMenu: {
		logout: string;
		logoutConfirmTitle: string;
		logoutConfirmContent: string;
	};
	buttons: {
		confirm: string;
		cancel: string;
	};
	// biome-ignore lint/suspicious/noExplicitAny: 需要支持其他国际化键
	[key: string]: any;
}

/**
 * Modal 实例接口
 */
export interface ModalInstance {
	confirm: (config: { title: string; content: string; okText: string; cancelText: string; onOk: () => void }) => void;
}

/**
 * Message 实例接口
 */
export interface MessageInstance {
	success: (text: string) => void;
	error: (text: string) => void;
	warning: (text: string) => void;
	info: (text: string) => void;
}

/**
 * 账号菜单项配置
 * 支持普通菜单项和分割线
 */
export type AccountMenuItem =
	| {
			/** 菜单项类型 - 普通菜单项 */
			type?: 'item';
			/** 唯一标识 */
			key: string;
			/** RemixIcon 图标类名，如 'ri-settings-line' */
			icon: string;
			/** 菜单项标签（多语言配置） */
			label: Record<Locale, string>;
			/** 点击事件处理函数 */
			onClick: (navigate: (path: string) => void, modal: ModalInstance, message: MessageInstance) => void;
	  }
	| {
			/** 菜单项类型 - 分割线 */
			type: 'divider';
	  };

// ==================== 菜单配置 ====================

/**
 * 自定义账号菜单项配置
 * 这些菜单项会显示在退出登录之前
 *
 * @example
 * // 添加个人中心菜单项
 * {
 *   type: 'item',
 *   key: 'profile',
 *   icon: 'ri-user-line',
 *   label: {
 *     'zh-CN': '个人中心',
 *     'en-US': 'Profile',
 *   },
 *   onClick: (navigate) => {
 *     navigate('/profile');
 *   },
 * }
 *
 * @example
 * // 添加分割线
 * {
 *   type: 'divider',
 * }
 */
export const accountMenuItems: AccountMenuItem[] = [
	// 示例：个人中心
	{
		type: 'item',
		key: 'profile',
		icon: 'ri-user-line',
		label: {
			'zh-CN': '个人中心',
			'en-US': 'Profile',
		},
		onClick: (navigate) => {
			navigate('/profile');
		},
	},
	// 示例：系统设置菜单项
	// {
	// 	type: 'item',
	// 	key: 'system-settings',
	// 	icon: 'ri-settings-3-line',
	// 	label: {
	// 		'zh-CN': '系统设置',
	// 		'en-US': 'System Settings',
	// 	},
	// 	onClick: (navigate) => {
	// 		navigate('/settings');
	// 	},
	// },
	// 示例：分割线
	// {
	// 	type: 'divider',
	// },
	// 示例：帮助中心
	// {
	// 	type: 'item',
	// 	key: 'help',
	// 	icon: 'ri-question-line',
	// 	label: {
	// 		'zh-CN': '帮助中心',
	// 		'en-US': 'Help Center',
	// 	},
	// 	onClick: (navigate) => {
	// 		navigate('/help');
	// 	},
	// },
];

/**
 * 构建账号菜单配置
 * 将扩展配置转换为 Ant Design Menu 所需的格式
 *
 * @param locale 当前语言
 * @param commonLocale 通用国际化文本
 * @returns Ant Design Menu items 配置
 */
export function buildAccountMenuItems(locale: Locale, commonLocale: CommonLocale): MenuProps['items'] {
	const items: MenuProps['items'] = [];

	// 扩展菜单项
	for (const item of accountMenuItems) {
		if (item.type === 'divider') {
			items.push({ type: 'divider' });
		} else {
			items.push({
				key: item.key,
				icon: <i className={item.icon} />,
				label: item.label[locale],
			});
		}
	}

	// 添加分割线（如果有扩展项）
	if (accountMenuItems.length > 0) {
		items.push({ type: 'divider' });
	}

	// 最后一项：退出登录（固定）
	items.push({
		key: 'logout',
		icon: <i className="ri-logout-box-line" />,
		label: commonLocale.accountMenu.logout,
	});

	return items;
}

/**
 * 处理账号菜单点击事件
 *
 * @param key 菜单项 key
 * @param navigate 路由导航函数
 * @param modal Ant Design Modal 实例
 * @param message Ant Design Message 实例
 * @param commonLocale 通用国际化文本
 * @param handleLogout 退出登录处理函数
 */
export function handleAccountMenuClick(
	key: string,
	navigate: (path: string) => void,
	modal: ModalInstance,
	message: MessageInstance,
	commonLocale: CommonLocale,
	handleLogout: () => void
) {
	// 处理固定菜单项：退出登录
	if (key === 'logout') {
		modal.confirm({
			title: commonLocale.accountMenu.logoutConfirmTitle,
			content: commonLocale.accountMenu.logoutConfirmContent,
			okText: commonLocale.buttons.confirm,
			cancelText: commonLocale.buttons.cancel,
			onOk: () => {
				handleLogout();
			},
		});
		return;
	}

	// 处理扩展菜单项
	const customItem = accountMenuItems.find((item) => item.type === 'item' && item.key === key);
	if (customItem && customItem.type === 'item') {
		customItem.onClick(navigate, modal, message);
	}
}
