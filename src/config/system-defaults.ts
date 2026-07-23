import type { BorderRadius, ContentWidth, MenuLayout, PageTransitionType, TabsStyle, ThemeMode } from '@/store/types';

/**
 * 系统默认配置值集合，保持为无副作用的静态模块。
 *
 * 该模块只包含静态默认值，避免配置工具与 Zustand Store 之间形成运行时循环依赖。
 */
export const SYSTEM_DEFAULTS = {
	theme: {
		themeMode: 'system' as ThemeMode,
		primaryColor: '#1677ff',
	},
	layout: {
		menuLayout: 'vertical' as MenuLayout,
		contentWidth: 'full' as ContentWidth,
		fixedWidthMax: 1200,
		enableFloatingUI: true,
		borderRadius: 8 as BorderRadius,
	},
	display: {
		enableRefreshButton: true,
		enableCollapseButton: true,
		enableHeaderButtons: true,
		menuCollapsed: false,
		enableTabs: true,
		enableImmersiveMode: false,
		enableCardContainer: true,
		enableCompactMode: false,
		sidebarToolbar: false,
	},
	tabs: {
		tabsStyle: 'default' as TabsStyle,
		maxTabsCount: 16,
	},
	animation: {
		enablePageTransition: true,
		pageTransitionType: 'slideLeft' as PageTransitionType,
		pageTransitionDuration: 300,
	},
	cache: {
		enablePageCache: false,
	},
} as const;

export type SystemDefaultsConfig = typeof SYSTEM_DEFAULTS;
