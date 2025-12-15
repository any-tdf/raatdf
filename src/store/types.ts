/**
 * 语言类型 - 从 locales 配置导入
 */
export type { Locale } from '@/locales';

import type { MenuItem } from '@/api/mocks/menu';
import type { Locale } from '@/locales';

export type { MenuItem } from '@/api/mocks/menu';

/**
 * 主题模式类型
 */
export type ThemeMode = 'system' | 'light' | 'dark';

/**
 * 主题模式常量
 */
export const ThemeMode = {
	SYSTEM: 'system' as const,
	LIGHT: 'light' as const,
	DARK: 'dark' as const,
} as const;

/**
 * 菜单布局类型
 */
export type MenuLayout = 'vertical' | 'horizontal' | 'mixed' | 'double-column';

/**
 * 菜单布局常量
 */
export const MenuLayout = {
	VERTICAL: 'vertical' as const,
	HORIZONTAL: 'horizontal' as const,
	MIXED: 'mixed' as const,
	DOUBLE_COLUMN: 'double-column' as const,
} as const;

/**
 * 内容宽度类型
 */
export type ContentWidth = 'full' | 'fixed';

/**
 * 内容宽度常量
 */
export const ContentWidth = {
	FULL: 'full' as const,
	FIXED: 'fixed' as const,
} as const;

/**
 * 界面圆角类型 - 支持 0, 2, 4, 6, 8, 12, 16, 20, 24 px
 */
export type BorderRadius = 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24;

/**
 * 界面圆角常量
 */
export const BorderRadius = {
	ZERO: 0 as const,
	TWO: 2 as const,
	FOUR: 4 as const,
	SIX: 6 as const,
	EIGHT: 8 as const,
	TWELVE: 12 as const,
	SIXTEEN: 16 as const,
	TWENTY: 20 as const,
	TWENTY_FOUR: 24 as const,
} as const;

/**
 * 标签页样式类型
 */
export type TabsStyle = 'default' | 'button' | 'simple' | 'card';

/**
 * 标签页样式常量
 */
export const TabsStyle = {
	DEFAULT: 'default' as const, // 默认样式 (当前的样式)
	BUTTON: 'button' as const, // 按钮式
	SIMPLE: 'simple' as const, // 简洁式
	CARD: 'card' as const, // 卡片式
} as const;

/**
 * 页面过渡动画类型
 */
export type PageTransitionType = 'none' | 'fade' | 'slideLeft' | 'slideUp' | 'slideDown' | 'scale';

/**
 * 页面过渡动画类型常量
 */
export const PageTransitionType = {
	NONE: 'none' as const, // 无动画
	FADE: 'fade' as const, // 淡入淡出
	SLIDE_LEFT: 'slideLeft' as const, // 左侧滑入
	SLIDE_UP: 'slideUp' as const, // 上方滑入
	SLIDE_DOWN: 'slideDown' as const, // 下方滑入
	SCALE: 'scale' as const, // 缩放
} as const;

/**
 * 标签页项接口
 */
export interface TabItem {
	/** 标签页唯一标识（路径） */
	key: string;
	/** 标签页标题 */
	label: string;
	/** 标签页图标 */
	icon?: string;
	/** 是否可关闭 */
	closable?: boolean;
	/** 是否固定 */
	pinned?: boolean;
}

/**
 * 缓存页面项
 */
export interface CachedPageItem {
	/** 页面路径（唯一标识） */
	path: string;
	/** 最后访问时间（用于 LRU 排序） */
	lastAccessTime: number;
}

/**
 * 主题状态接口
 */
export interface ThemeState {
	/** 当前主题模式 */
	mode: ThemeMode;
	/** 是否为深色模式（仅在实际渲染时有效） */
	isDark: boolean;
}

/**
 * 主题状态操作接口
 */
export interface ThemeActions {
	/** 设置主题模式 */
	setThemeMode: (mode: ThemeMode) => void;
	/** 切换主题模式（在系统、浅色、深色之间循环） */
	toggleTheme: () => void;
}

/**
 * 系统偏好设置接口
 */
export interface SystemPreferences {
	/** 界面语言 */
	locale: Locale;
	/** 主题模式 */
	themeMode: ThemeMode;
	/** 菜单布局 */
	menuLayout: MenuLayout;
	/** 系统主题色 */
	primaryColor: string;
	/** 内容区域宽度 */
	contentWidth: ContentWidth;
	/** 定宽布局的最大宽度 */
	fixedWidthMax: number;
	/** 是否悬浮式界面 */
	isFloatingUI: boolean;
	/** 界面圆角大小 */
	borderRadius: BorderRadius;
	/** 是否显示刷新按钮 */
	showRefreshButton: boolean;
	/** 是否显示折叠菜单按钮 */
	showCollapseButton: boolean;
	/** 菜单是否折叠（仅在不显示折叠按钮时在设置中控制） */
	menuCollapsed: boolean;
	/** 是否显示头部按钮 */
	showHeaderButtons: boolean;
	/** 是否启用多标签页 */
	showTabs: boolean;
	/** 标签页样式 */
	tabsStyle: TabsStyle;
	/** 打开的标签页列表 */
	tabs: TabItem[];
	/** 当前激活的标签页 */
	activeTabKey: string;
	/** 是否开启沉浸模式 */
	isImmersiveMode: boolean;
	/** 内容区域是否有背景色 */
	showContentBackground: boolean;
	/** 是否启用紧凑模式 */
	enableCompactMode: boolean;
	/** 是否启用页面切换动画 */
	enablePageTransition: boolean;
	/** 页面切换动画类型 */
	pageTransitionType: PageTransitionType;
	/** 动画持续时间（毫秒） */
	pageTransitionDuration: number;
	/** 是否启用页面缓存 */
	enablePageCache: boolean;
	/** 当前缓存的页面列表（运行时状态，不持久化） */
	cachedPages: CachedPageItem[];
	/** 是否将工具栏放置在侧边栏底部（仅垂直布局有效） */
	sidebarToolbar: boolean;
}

/**
 * 系统偏好设置操作接口
 */
export interface SystemPreferencesActions {
	/** 设置界面语言 */
	setLocale: (locale: Locale) => void;
	/** 设置主题模式 */
	setThemeMode: (mode: ThemeMode) => void;
	/** 设置菜单布局 */
	setMenuLayout: (layout: MenuLayout) => void;
	/** 设置主题色 */
	setPrimaryColor: (color: string) => void;
	/** 设置内容宽度 */
	setContentWidth: (width: ContentWidth) => void;
	/** 设置定宽布局的最大宽度 */
	setFixedWidthMax: (width: number) => void;
	/** 设置悬浮式界面 */
	setFloatingUI: (enabled: boolean) => void;
	/** 设置界面圆角 */
	setBorderRadius: (radius: BorderRadius) => void;
	/** 设置是否显示刷新按钮 */
	setShowRefreshButton: (enabled: boolean) => void;
	/** 设置是否显示折叠菜单按钮 */
	setShowCollapseButton: (enabled: boolean) => void;
	/** 设置菜单折叠状态 */
	setMenuCollapsed: (collapsed: boolean) => void;
	/** 设置是否显示头部按钮 */
	setShowHeaderButtons: (enabled: boolean) => void;
	/** 设置是否显示多标签页 */
	setShowTabs: (enabled: boolean) => void;
	/** 设置标签页样式 */
	setTabsStyle: (style: TabsStyle) => void;
	/** 添加标签页 */
	addTab: (tab: TabItem) => void;
	/** 移除标签页 */
	removeTab: (key: string) => void;
	/** 设置当前激活的标签页 */
	setActiveTabKey: (key: string) => void;
	/** 固定标签页 */
	pinTab: (key: string) => void;
	/** 取消固定标签页 */
	unpinTab: (key: string) => void;
	/** 设置沉浸模式 */
	setImmersiveMode: (enabled: boolean) => void;
	/** 设置内容区域是否有背景色 */
	setShowContentBackground: (enabled: boolean) => void;
	/** 设置是否启用紧凑模式 */
	setEnableCompactMode: (enabled: boolean) => void;
	/** 设置是否启用页面切换动画 */
	setEnablePageTransition: (enabled: boolean) => void;
	/** 设置页面切换动画类型 */
	setPageTransitionType: (type: PageTransitionType) => void;
	/** 设置动画持续时间 */
	setPageTransitionDuration: (duration: number) => void;
	/** 设置是否启用页面缓存 */
	setEnablePageCache: (enabled: boolean) => void;
	/** 添加页面到缓存 */
	addPageToCache: (path: string) => void;
	/** 从缓存中移除页面 */
	removePageFromCache: (path: string) => void;
	/** 清空所有缓存 */
	clearAllCache: () => void;
	/** 清空所有标签页和缓存（用于退出登录） */
	clearAllTabsAndCache: () => void;
	/** 设置是否将工具栏放置在侧边栏底部 */
	setSidebarToolbar: (enabled: boolean) => void;
	/** 重置为默认设置 */
	resetToDefaults: () => void;
	/** 用户菜单数据 */
	menuData: MenuItem[];
	/** 设置菜单数据 */
	setMenuData: (menuData: MenuItem[]) => void;
}

/**
 * 完整的系统状态接口
 */
export interface SystemState extends SystemPreferences {
	/** 是否为深色模式（仅在实际渲染时有效） */
	isDark: boolean;
	/** 设置界面语言 */
	setLocale: (locale: Locale) => void;
	/** 设置主题模式 */
	setThemeMode: (mode: ThemeMode) => void;
	/** 切换主题模式（在系统、浅色、深色之间循环） */
	toggleTheme: () => void;
	/** 设置菜单布局 */
	setMenuLayout: (layout: MenuLayout) => void;
	/** 设置主题色 */
	setPrimaryColor: (color: string) => void;
	/** 设置内容宽度 */
	setContentWidth: (width: ContentWidth) => void;
	/** 设置定宽布局的最大宽度 */
	setFixedWidthMax: (width: number) => void;
	/** 设置悬浮式界面 */
	setFloatingUI: (enabled: boolean) => void;
	/** 设置界面圆角 */
	setBorderRadius: (radius: BorderRadius) => void;
	/** 设置是否显示刷新按钮 */
	setShowRefreshButton: (enabled: boolean) => void;
	/** 设置是否显示折叠菜单按钮 */
	setShowCollapseButton: (enabled: boolean) => void;
	/** 设置菜单折叠状态 */
	setMenuCollapsed: (collapsed: boolean) => void;
	/** 设置是否显示头部按钮 */
	setShowHeaderButtons: (enabled: boolean) => void;
	/** 设置是否显示多标签页 */
	setShowTabs: (enabled: boolean) => void;
	/** 设置标签页样式 */
	setTabsStyle: (style: TabsStyle) => void;
	/** 添加标签页 */
	addTab: (tab: TabItem) => void;
	/** 移除标签页 */
	removeTab: (key: string) => void;
	/** 设置当前激活的标签页 */
	setActiveTabKey: (key: string) => void;
	/** 固定标签页 */
	pinTab: (key: string) => void;
	/** 取消固定标签页 */
	unpinTab: (key: string) => void;
	/** 设置沉浸模式 */
	setImmersiveMode: (enabled: boolean) => void;
	/** 设置内容区域是否有背景色 */
	setShowContentBackground: (enabled: boolean) => void;
	/** 设置是否启用紧凑模式 */
	setEnableCompactMode: (enabled: boolean) => void;
	/** 设置是否启用页面切换动画 */
	setEnablePageTransition: (enabled: boolean) => void;
	/** 设置页面切换动画类型 */
	setPageTransitionType: (type: PageTransitionType) => void;
	/** 设置动画持续时间 */
	setPageTransitionDuration: (duration: number) => void;
	/** 设置是否启用页面缓存 */
	setEnablePageCache: (enabled: boolean) => void;
	/** 添加页面到缓存 */
	addPageToCache: (path: string) => void;
	/** 从缓存中移除页面 */
	removePageFromCache: (path: string) => void;
	/** 清空所有缓存 */
	clearAllCache: () => void;
	/** 清空所有标签页和缓存（用于退出登录） */
	clearAllTabsAndCache: () => void;
	/** 设置是否将工具栏放置在侧边栏底部 */
	setSidebarToolbar: (enabled: boolean) => void;
	/** 重置为默认设置 */
	resetToDefaults: () => void;
	/** 用户菜单数据 */
	menuData: MenuItem[];
	/** 设置菜单数据 */
	setMenuData: (menuData: MenuItem[]) => void;
}
