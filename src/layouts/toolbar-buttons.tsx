/**
 * 工具栏图标按钮配置
 *
 * 在此文件中配置工具栏的图标按钮及相关组件
 * 按钮将按数组顺序从左到右显示
 * 注意：设置按钮是内置的，不需要在此配置
 *
 * 这些按钮可能显示在：
 * - 头部右侧（默认位置）
 * - 侧边栏底部（当 sidebarToolbar 启用且为垂直布局时）
 */

import { Button, Empty, List, Space } from 'antd';
import { useState } from 'react';
import type { Notification } from '@/api/mocks/notifications';
import { getNotificationData } from '@/api/mocks/notifications';
import type { Locale } from '@/locales/system/types';
import { useSystemStore } from '@/store';

// ==================== 国际化配置 ====================

/**
 * 通知和聊天的国际化配置
 */
const i18nConfig = {
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
		// 侧边栏工具栏按钮标签
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
		// 侧边栏工具栏按钮标签
		buttonLabels: {
			notification: 'Notifications',
			chat: 'Chat Box',
		},
	},
};

/**
 * 获取国际化文本
 */
function getI18nText(locale: Locale) {
	return i18nConfig[locale];
}

// ==================== 通知列表组件 ====================

interface NotificationListProps {
	/** 关闭 Popover 的回调 */
	onClose?: () => void;
}

/**
 * 通知列表组件
 */
function NotificationList({ onClose }: NotificationListProps) {
	const { locale } = useSystemStore();
	const t = getI18nText(locale);
	const [notifications, setNotifications] = useState<Notification[]>(getNotificationData(locale));

	// 获取未读通知数量
	const unreadCount = notifications.filter((n) => !n.read).length;

	// 处理通知项点击
	const handleNotificationClick = (id: string) => {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
	};

	// 清空所有通知
	const handleClearAll = () => {
		setNotifications([]);
		onClose?.();
	};

	// 标记所有为已读
	const handleMarkAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	return (
		<div style={{ width: '420px' }}>
			{/* 头部 */}
			<div
				style={{
					padding: '16px 20px',
					borderBottom: '1px solid var(--ant-color-border-secondary)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--ant-color-text)' }}>
						{t.notification.title}
					</span>
					{unreadCount > 0 && (
						<span
							style={{
								padding: '2px 8px',
								borderRadius: '10px',
								fontSize: '12px',
								fontWeight: 500,
								backgroundColor: 'var(--ant-color-error-bg)',
								color: 'var(--ant-color-error)',
							}}
						>
							{unreadCount} {t.notification.unreadCount}
						</span>
					)}
				</div>
				<Space size={8}>
					{unreadCount > 0 && (
						<Button
							type="text"
							size="small"
							onClick={handleMarkAllRead}
							style={{ padding: '0 8px', height: '28px', fontSize: '13px' }}
						>
							{t.notification.markAllRead}
						</Button>
					)}
					{notifications.length > 0 && (
						<Button
							type="text"
							size="small"
							onClick={handleClearAll}
							style={{ padding: '0 8px', height: '28px', fontSize: '13px', color: 'var(--ant-color-error)' }}
						>
							{t.notification.clear}
						</Button>
					)}
				</Space>
			</div>

			{/* 通知列表 */}
			{notifications.length === 0 ? (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={
						<span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: '14px' }}>{t.notification.empty}</span>
					}
					style={{ padding: '64px 0', margin: 0 }}
				/>
			) : (
				<div style={{ maxHeight: '420px', overflowY: 'auto' }}>
					<List
						dataSource={notifications}
						split={false}
						renderItem={(item) => {
							const iconMap = {
								info: 'ri-information-line',
								success: 'ri-checkbox-circle-line',
								warning: 'ri-error-warning-line',
								error: 'ri-close-circle-line',
							};

							const colorMap = {
								info: 'var(--ant-color-info)',
								success: 'var(--ant-color-success)',
								warning: 'var(--ant-color-warning)',
								error: 'var(--ant-color-error)',
							};

							const bgColorMap = {
								info: 'var(--ant-color-info-bg)',
								success: 'var(--ant-color-success-bg)',
								warning: 'var(--ant-color-warning-bg)',
								error: 'var(--ant-color-error-bg)',
							};

							return (
								<List.Item
									key={item.id}
									onClick={() => handleNotificationClick(item.id)}
									style={{
										padding: '16px 20px',
										cursor: 'pointer',
										backgroundColor: 'transparent',
										borderBottom: '1px solid var(--ant-color-border-secondary)',
										transition: 'all 0.2s ease',
									}}
								>
									<List.Item.Meta
										avatar={
											<div
												style={{
													width: '40px',
													height: '40px',
													borderRadius: '50%',
													backgroundColor: bgColorMap[item.type],
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<i
													className={iconMap[item.type]}
													style={{
														fontSize: '20px',
														color: colorMap[item.type],
													}}
												/>
											</div>
										}
										title={
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													marginBottom: '4px',
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
													<span
														style={{
															fontWeight: item.read ? 400 : 600,
															fontSize: '14px',
															color: 'var(--ant-color-text)',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{item.title}
													</span>
													{!item.read && (
														<span
															style={{
																width: '6px',
																height: '6px',
																borderRadius: '50%',
																backgroundColor: 'var(--ant-color-error)',
																flexShrink: 0,
															}}
														/>
													)}
												</div>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '4px',
														fontSize: '12px',
														color: 'var(--ant-color-text-tertiary)',
														flexShrink: 0,
														marginLeft: '12px',
														whiteSpace: 'nowrap',
													}}
												>
													<i className="ri-time-line" style={{ fontSize: '12px' }} />
													{item.time}
												</div>
											</div>
										}
										description={
											<div
												style={{
													color: 'var(--ant-color-text-secondary)',
													fontSize: '13px',
													lineHeight: '1.6',
												}}
											>
												{item.content}
											</div>
										}
									/>
								</List.Item>
							);
						}}
					/>
				</div>
			)}
		</div>
	);
}

/**
 * 获取未读通知数量
 * 用于判断是否显示红点
 */
function getUnreadNotificationCount(): number {
	// 注意：这里使用默认中文数据，因为这个函数在组件外部调用，无法获取当前 locale
	// 实际项目中，可以考虑从 store 中读取 locale 或使用其他方式
	const { locale } = useSystemStore.getState();
	return getNotificationData(locale).filter((n) => !n.read).length;
}

// ==================== 聊天组件 ====================

interface ChatListProps {
	/** 关闭 Popover 的回调 */
	onClose?: () => void;
}

/**
 * 聊天列表组件
 */
function ChatList({ onClose }: ChatListProps) {
	const { locale } = useSystemStore();
	const t = getI18nText(locale);

	return (
		<div style={{ width: '360px', padding: '48px 24px', textAlign: 'center' }}>
			<i className="ri-message-ai-3-line" style={{ fontSize: '48px', color: 'var(--ant-color-text-tertiary)' }} />
			<div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--ant-color-text-secondary)' }}>
				{t.chat.developing}
			</div>
			<Button type="primary" onClick={onClose} style={{ marginTop: '16px' }} size="small">
				{t.chat.close}
			</Button>
		</div>
	);
}

/**
 * 获取未读消息数量
 * 用于判断是否显示红点
 */
function getUnreadChatCount(): number {
	// 这里可以返回实际的未读消息数量
	return 2;
}

// ==================== 类型定义 ====================

/**
 * 图标动效类型
 */
export type IconAnimation =
	| 'icon-spin-hover' // 旋转动画 - 180 度半圈旋转
	| 'icon-wiggle' // 摇摆动画 - 快速左右摇摆
	| 'icon-scale-pulse' // 缩放脉冲动画 - 周期性缩放
	| 'icon-scale-bounce' // 缩放弹跳动画 - 弹性缩放效果
	| 'icon-heartbeat' // 心跳动画 - 模拟心跳节奏
	| 'icon-bounce-y' // 上下跳动动画 - 垂直方向弹跳
	| 'icon-hop' // 轻快跳跃动画 - 轻盈的跳跃效果
	| 'icon-shake' // 摇晃动画 - 左右剧烈摇晃
	| 'icon-tada' // 欢庆动画 - 放大旋转组合效果
	| 'icon-swing' // 摆动动画 - 钟摆式左右摆动
	| 'icon-rubber-band'; // 橡皮筋动画 - 拉伸回弹效果

/**
 * Popover 配置
 */
export interface PopoverConfig {
	/** Popover 内容组件 */
	content: (props: { onClose: () => void }) => React.ReactNode;
	/** 触发方式 */
	trigger?: 'click' | 'hover';
	/** 弹出位置 */
	placement?: 'bottomRight' | 'bottomLeft' | 'bottom' | 'topRight' | 'topLeft' | 'top';
	/** 是否显示箭头 */
	arrow?: boolean;
	/** 获取红点显示状态的函数 */
	shouldShowDot?: () => boolean;
}

/**
 * 头部图标按钮配置项
 */
export interface HeaderIconButton {
	/** 唯一标识 */
	key: string;
	/** RemixIcon 图标类名，如 'ri-notification-line' */
	icon: string;
	/** 悬停动效类名 */
	animation?: IconAnimation;
	/** 点击事件处理函数（如果配置了 popover，此项将被忽略） */
	onClick?: () => void;
	/** 是否显示红点（固定显示，如果需要动态显示请使用 popover.shouldShowDot） */
	dot?: boolean;
	/** Popover 配置（配置后按钮将显示 Popover） */
	popover?: PopoverConfig;
	/** 侧边栏工具栏中显示的标签 key（对应 i18nConfig.buttonLabels 中的 key） */
	labelKey?: string;
}

// ==================== 按钮配置 ====================

/**
 * 自定义头部图标按钮配置
 * 这些按钮会显示在设置按钮的左侧
 *
 * @example
 * // 添加通知按钮
 * {
 *   key: 'notification',
 *   icon: 'ri-notification-line',
 *   animation: 'icon-swing',
 *   popover: {
 *     content: ({ onClose }) => <NotificationList onClose={onClose} />,
 *     trigger: 'click',
 *     placement: 'bottomRight',
 *     shouldShowDot: () => getUnreadNotificationCount() > 0,
 *   },
 * }
 */
export const toolbarButtons: HeaderIconButton[] = [
	// 通知按钮
	{
		key: 'notification',
		icon: 'ri-notification-line',
		animation: 'icon-swing',
		labelKey: 'notification',
		popover: {
			content: ({ onClose }) => <NotificationList onClose={onClose} />,
			trigger: 'click',
			placement: 'bottomRight',
			arrow: false,
			shouldShowDot: () => getUnreadNotificationCount() > 0,
		},
	},
	// 聊天按钮
	{
		key: 'chat',
		icon: 'ri-message-ai-3-line',
		animation: 'icon-bounce-y',
		labelKey: 'chat',
		popover: {
			content: ({ onClose }) => <ChatList onClose={onClose} />,
			trigger: 'click',
			placement: 'bottomRight',
			arrow: true,
			shouldShowDot: () => getUnreadChatCount() > 0,
		},
	},
];

/**
 * 获取按钮的国际化标签
 * @param labelKey 标签 key
 * @param locale 语言
 * @returns 国际化后的标签文本
 */
export function getButtonLabel(labelKey: string, locale: Locale): string {
	const labels = i18nConfig[locale]?.buttonLabels;
	return labels?.[labelKey as keyof typeof labels] || labelKey;
}
