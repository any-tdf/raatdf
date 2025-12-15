import { zhCNIntl } from '@ant-design/pro-components';
import datePickerZhCN from 'antd/es/date-picker/locale/zh_CN';
import zhCN from 'antd/locale/zh_CN';
import type { LocalizationConfig } from './types';

/**
 * 简体中文翻译配置
 */
const zhCNConfig: LocalizationConfig = {
	meta: {
		value: 'zh-CN',
		label: '简体中文',
		flag: '🇨🇳',
		antdLocale: 'zh_CN',
		antdLocaleModule: zhCN,
		dayjsLocale: 'zh-cn',
		datePickerLocale: datePickerZhCN,
		proComponentsIntl: zhCNIntl,
	},
	common: {
		system: {
			name: 'RAATDF',
			tagline: '高效、优雅、轻量的后台管理系统',
			copyright: 'Built with any-tdf',
		},
		api: {
			badRequest: '请求参数错误',
			unauthorized: '未授权，请重新登录',
			forbidden: '禁止访问',
			notFound: '请求的资源不存在',
			timeout: '请求超时',
			conflict: '请求冲突',
			validationError: '验证失败',
			serverError: '服务器内部错误',
			gatewayError: '网关错误',
			serviceUnavailable: '服务暂时不可用',
			networkError: '网络连接失败，请检查网络设置',
			connectionError: '网络连接出错',
			unknownError: '网络请求出错，请稍后重试',
		},
		theme: {
			title: '主题',
			system: '系统',
			light: '浅色',
			dark: '深色',
		},
		themeColor: {
			title: '主题色',
			customize: '自定义',
			defaultBlue: '默认蓝',
			greenShade: '悠扬青',
			warmOrange: '热情橙',
			elegantPurple: '优雅紫',
			charmRed: '魅惑红',
			calmTeal: '宁静青',
			verdigris: '青绿色',
			amber: '琥珀色',
			roseGold: '玫瑰金',
			indigo: '靛蓝色',
		},
		layout: {
			title: '布局',
			vertical: '侧边栏',
			horizontal: '顶部栏',
			mixed: '混合',
			doubleColumn: '双栏',
		},
		pageWidth: {
			title: '页面宽度',
			full: '自适应',
			fixed: '定宽',
		},
		display: {
			title: '显示',
			fullscreen: '全屏显示',
			floatingUI: '悬浮界面',
			refreshButton: '刷新按钮',
			collapseButton: '折叠按钮',
			headerButtons: '顶部按钮',
			headerButtonsTooltip: '是否显示顶部设置按钮左侧区域功能',
			immersiveMode: '沉浸模式',
			immersiveModeLimit: '隐藏所有非页面内容，右上角可退出',
			cardContainer: '卡片容器',
			expandMenu: '展开菜单',
			multiTabs: '多标签页',
			multiTabsLimit: '最多 16 个，超过后自动关闭最早的',
			pageCache: '缓存页面',
			pageCacheLimit: '缓存页面数据可能影响性能',
			language: '语言',
			compactMode: '紧凑模式',
			sidebarToolbar: '侧栏工具',
			sidebarToolbarTooltip: '将头像、设置等按钮放置在侧边栏底部，仅侧边栏布局有效',
		},
		borderRadius: {
			title: '圆角',
		},
		tabsStyle: {
			title: '标签样式',
			default: '默认',
			button: '按钮',
			simple: '简洁',
			card: '堆叠',
		},
		pageTransition: {
			title: '切换动画',
			slideLeft: '左侧滑入',
			fade: '淡入淡出',
			slideUp: '上方滑入',
			slideDown: '下方滑入',
			scale: '缩放',
			none: '无',
		},
		buttons: {
			reset: '重置默认',
			confirm: '确定',
			cancel: '取消',
			close: '关闭',
		},
		dialogs: {
			confirmReset: '确认重置',
			confirmResetDescription: '确定要重置所有设置为默认值吗？',
		},
		drawer: {
			systemSettings: '系统设置',
		},
		accountMenu: {
			logout: '退出登录',
			logoutConfirmTitle: '退出登录',
			logoutConfirmContent: '确定要退出登录吗？',
			logoutSuccess: '已退出登录',
			logoutFailed: '退出登录失败，请重试',
		},
		permission: {
			noAccess: '您没有权限访问此页面',
		},
		tabContextMenu: {
			pin: '固定',
			unpin: '取消固定',
			closeLeft: '关闭左侧',
			closeRight: '关闭右侧',
			closeOthers: '关闭其他',
		},
		loading: {
			checkingAuth: '检查登录状态中...',
		},
	},
	config: {
		theme: {
			modes: [
				{ label: '系统', description: '跟随系统偏好设置' },
				{ label: '浅色', description: '始终使用浅色主题' },
				{ label: '深色', description: '始终使用深色主题' },
			],
			presetColors: [
				{ label: '默认蓝', name: 'defaultBlue' },
				{ label: '悠扬青', name: 'greenShade' },
				{ label: '热情橙', name: 'warmOrange' },
				{ label: '优雅紫', name: 'elegantPurple' },
				{ label: '魅惑红', name: 'charmRed' },
				{ label: '宁静青', name: 'calmTeal' },
				{ label: '青绿色', name: 'verdigris' },
				{ label: '琥珀色', name: 'amber' },
				{ label: '玫瑰金', name: 'roseGold' },
				{ label: '靛蓝色', name: 'indigo' },
			],
		},
		layout: {
			menuLayouts: [
				{ value: 'vertical', label: '侧边栏' },
				{ value: 'horizontal', label: '顶部栏' },
				{ value: 'mixed', label: '混合' },
			],
			contentWidths: [
				{ value: 'full', label: '自适应' },
				{ value: 'fixed', label: '定宽' },
			],
			borderRadiuses: [
				{ value: '0', label: '0' },
				{ value: '2', label: '2' },
				{ value: '4', label: '4' },
				{ value: '6', label: '6' },
				{ value: '8', label: '8' },
				{ value: '12', label: '12' },
				{ value: '16', label: '16' },
				{ value: '20', label: '20' },
				{ value: '24', label: '24' },
			],
		},
		tabs: {
			options: [
				{ value: 'default', label: '默认' },
				{ value: 'button', label: '按钮' },
				{ value: 'simple', label: '简洁' },
				{ value: 'card', label: '堆叠' },
			],
		},
		pageTransition: {
			options: [
				{ value: 'slideLeft', label: '左侧滑入' },
				{ value: 'fade', label: '淡入淡出' },
				{ value: 'slideUp', label: '上方滑入' },
				{ value: 'slideDown', label: '下方滑入' },
				{ value: 'scale', label: '缩放' },
				{ value: 'none', label: '无' },
			],
		},
	},
};

export default zhCNConfig;
