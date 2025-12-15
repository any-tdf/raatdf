/**
 * 多语言类型定义
 */

import type { IntlType } from '@ant-design/pro-components';
import type { PickerLocale } from 'antd/es/date-picker/generatePicker';
import type { Locale as AntdLocale } from 'antd/es/locale';

/**
 * 支持的语言代码类型
 * 添加新语言时，需要在此添加对应的语言代码
 */
export type Locale = 'zh-CN' | 'en-US';

/**
 * 语言配置项接口
 */
export interface LocaleOption {
	/** 语言代码 */
	value: Locale;
	/** 语言显示名称（本地化名称） */
	label: string;
	/** 国旗 emoji */
	flag: string;
	/** Ant Design 语言包标识 */
	antdLocale: string;
	/** Ant Design 语言包实例 */
	antdLocaleModule: AntdLocale;
	/** dayjs 语言包标识（如 'zh-cn', 'en', 'ja'） */
	dayjsLocale: string;
	/** DatePicker 语言包实例 */
	datePickerLocale: PickerLocale;
	/** Pro Components 国际化实例 */
	proComponentsIntl: IntlType;
}

export interface CommonUI {
	// 系统信息
	system: {
		name: string;
		tagline: string;
		copyright: string;
	};
	// API 错误消息
	api: {
		badRequest: string;
		unauthorized: string;
		forbidden: string;
		notFound: string;
		timeout: string;
		conflict: string;
		validationError: string;
		serverError: string;
		gatewayError: string;
		serviceUnavailable: string;
		networkError: string;
		connectionError: string;
		unknownError: string;
	};
	// 系统主题
	theme: {
		title: string;
		system: string;
		light: string;
		dark: string;
	};
	// 主题色
	themeColor: {
		title: string;
		customize: string;
		defaultBlue: string;
		greenShade: string;
		warmOrange: string;
		elegantPurple: string;
		charmRed: string;
		calmTeal: string;
		verdigris: string;
		amber: string;
		roseGold: string;
		indigo: string;
	};
	// 布局
	layout: {
		title: string;
		vertical: string;
		horizontal: string;
		mixed: string;
		doubleColumn: string;
	};
	// 页面宽度
	pageWidth: {
		title: string;
		full: string;
		fixed: string;
	};
	// 界面显示
	display: {
		title: string;
		fullscreen: string;
		floatingUI: string;
		refreshButton: string;
		collapseButton: string;
		headerButtons: string;
		headerButtonsTooltip: string;
		immersiveMode: string;
		immersiveModeLimit: string;
		cardContainer: string;
		expandMenu: string;
		multiTabs: string;
		multiTabsLimit: string;
		pageCache: string;
		pageCacheLimit: string;
		language: string;
		compactMode: string;
		sidebarToolbar: string;
		sidebarToolbarTooltip: string;
	};
	// 界面圆角
	borderRadius: {
		title: string;
	};
	// 标签页样式
	tabsStyle: {
		title: string;
		default: string;
		button: string;
		simple: string;
		card: string;
	};
	// 页面切换动画
	pageTransition: {
		title: string;
		slideLeft: string;
		fade: string;
		slideUp: string;
		slideDown: string;
		scale: string;
		none: string;
	};
	// 按钮文本
	buttons: {
		reset: string;
		confirm: string;
		cancel: string;
		close: string;
	};
	// 对话框文本
	dialogs: {
		confirmReset: string;
		confirmResetDescription: string;
	};
	// 抽屉标题
	drawer: {
		systemSettings: string;
	};
	// 账户菜单
	accountMenu: {
		logout: string;
		logoutConfirmTitle: string;
		logoutConfirmContent: string;
		logoutSuccess: string;
		logoutFailed: string;
	};
	// 权限相关
	permission: {
		noAccess: string;
	};
	// 标签页右键菜单
	tabContextMenu: {
		pin: string;
		unpin: string;
		closeLeft: string;
		closeRight: string;
		closeOthers: string;
	};
	// 加载状态
	loading: {
		checkingAuth: string;
	};
}

export interface ConfigItems {
	// 配置项选项列表
	theme: {
		modes: Array<{ label: string; description: string }>;
		presetColors: Array<{ label: string; name: string }>;
	};
	layout: {
		menuLayouts: Array<{ value: string; label: string }>;
		contentWidths: Array<{ value: string; label: string }>;
		borderRadiuses: Array<{ value: string; label: string }>;
	};
	tabs: {
		options: Array<{ value: string; label: string }>;
	};
	pageTransition: {
		options: Array<{ value: string; label: string }>;
	};
}

export interface LocalizationConfig {
	/** 语言元信息 */
	meta: LocaleOption;
	/** 通用 UI 文本 */
	common: CommonUI;
	/** 配置项文本 */
	config: ConfigItems;
}
