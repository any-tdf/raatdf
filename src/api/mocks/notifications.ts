/**
 * 通知数据 Mock
 */

import type { Locale } from '@/locales/system/types';

export interface Notification {
	/** 通知 ID */
	id: string;
	/** 通知类型 */
	type: 'info' | 'success' | 'warning' | 'error';
	/** 通知标题 */
	title: string;
	/** 通知内容 */
	content: string;
	/** 通知时间 */
	time: string;
	/** 是否已读 */
	read: boolean;
}

/**
 * 中文通知列表数据
 */
const notificationDataZhCN: Notification[] = [
	{
		id: '1',
		type: 'info',
		title: '系统更新',
		content: '系统已更新至 v2.0.0 版本，新增多项功能优化',
		time: '5 分钟前',
		read: false,
	},
	{
		id: '2',
		type: 'success',
		title: '订单完成',
		content: '您的订单 #12345 已完成并发货',
		time: '1 小时前',
		read: false,
	},
	{
		id: '3',
		type: 'warning',
		title: '权限变更',
		content: '您的账户权限已更新，请重新登录',
		time: '2 小时前',
		read: false,
	},
	{
		id: '4',
		type: 'error',
		title: '操作失败',
		content: '数据同步失败，请检查网络连接后重试',
		time: '3 小时前',
		read: true,
	},
	{
		id: '5',
		type: 'info',
		title: '新消息',
		content: '您有 3 条新的系统消息待查看',
		time: '昨天',
		read: true,
	},
];

/**
 * 英文通知列表数据
 */
const notificationDataEnUS: Notification[] = [
	{
		id: '1',
		type: 'info',
		title: 'System Update',
		content: 'System has been updated to v2.0.0 with multiple feature optimizations',
		time: '5 minutes ago',
		read: false,
	},
	{
		id: '2',
		type: 'success',
		title: 'Order Completed',
		content: 'Your order #12345 has been completed and shipped',
		time: '1 hour ago',
		read: false,
	},
	{
		id: '3',
		type: 'warning',
		title: 'Permission Changed',
		content: 'Your account permissions have been updated, please log in again',
		time: '2 hours ago',
		read: false,
	},
	{
		id: '4',
		type: 'error',
		title: 'Operation Failed',
		content: 'Data synchronization failed, please check network connection and retry',
		time: '3 hours ago',
		read: true,
	},
	{
		id: '5',
		type: 'info',
		title: 'New Messages',
		content: 'You have 3 new system messages to review',
		time: 'Yesterday',
		read: true,
	},
];

/**
 * 根据语言获取通知数据
 */
export function getNotificationData(locale: Locale): Notification[] {
	return locale === 'zh-CN' ? notificationDataZhCN : notificationDataEnUS;
}

/**
 * 通知列表数据（默认中文，为了保持向后兼容）
 */
export const notificationData = notificationDataZhCN;
