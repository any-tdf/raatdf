export type { MenuItem, RouteMeta, UserRole } from '@/api/mocks/menu';
export type { Locale } from '@/locales';

import type { Locale } from '@/locales';

export type ThemeMode = 'system' | 'light' | 'dark';
export const ThemeMode = {
	SYSTEM: 'system' as const,
	LIGHT: 'light' as const,
	DARK: 'dark' as const,
};

export type MenuLayout = 'vertical' | 'horizontal' | 'mixed' | 'double-column';
export const MenuLayout = {
	VERTICAL: 'vertical' as const,
	HORIZONTAL: 'horizontal' as const,
	MIXED: 'mixed' as const,
	DOUBLE_COLUMN: 'double-column' as const,
};

export type ContentWidth = 'full' | 'fixed';
export const ContentWidth = {
	FULL: 'full' as const,
	FIXED: 'fixed' as const,
};

export type BorderRadius = 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24;
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
};

export type TabsStyle = 'default' | 'button' | 'simple' | 'card';
export const TabsStyle = {
	DEFAULT: 'default' as const,
	BUTTON: 'button' as const,
	SIMPLE: 'simple' as const,
	CARD: 'card' as const,
};

export type PageTransitionType = 'none' | 'fade' | 'slideLeft' | 'slideUp' | 'slideDown' | 'scale';
export const PageTransitionType = {
	NONE: 'none' as const,
	FADE: 'fade' as const,
	SLIDE_LEFT: 'slideLeft' as const,
	SLIDE_UP: 'slideUp' as const,
	SLIDE_DOWN: 'slideDown' as const,
	SCALE: 'scale' as const,
};

export interface TabItem {
	key: string;
	label: string;
	icon?: string;
	closable?: boolean;
	pinned?: boolean;
}

export interface TabMutationResult {
	activePath: string | null;
}

export interface CachedPageItem {
	path: string;
	lastAccessTime: number;
}

export interface ThemeState {
	mode: ThemeMode;
	isDark: boolean;
}

export interface ThemeActions {
	setThemeMode: (mode: ThemeMode) => void;
	toggleTheme: () => void;
}

export interface SystemPreferences {
	locale: Locale;
	themeMode: ThemeMode;
	menuLayout: MenuLayout;
	primaryColor: string;
	contentWidth: ContentWidth;
	fixedWidthMax: number;
	isFloatingUI: boolean;
	borderRadius: BorderRadius;
	showRefreshButton: boolean;
	showCollapseButton: boolean;
	menuCollapsed: boolean;
	activeTopMenuKey: string;
	showHeaderButtons: boolean;
	showTabs: boolean;
	tabsStyle: TabsStyle;
	tabs: TabItem[];
	activeTabKey: string;
	isImmersiveMode: boolean;
	showContentBackground: boolean;
	enableCompactMode: boolean;
	enablePageTransition: boolean;
	pageTransitionType: PageTransitionType;
	pageTransitionDuration: number;
	enablePageCache: boolean;
	cachedPages: CachedPageItem[];
	sidebarToolbar: boolean;
}

export interface SystemPreferencesActions {
	setLocale: (locale: Locale) => void;
	setThemeMode: (mode: ThemeMode) => void;
	toggleTheme: () => void;
	setMenuLayout: (layout: MenuLayout) => void;
	setPrimaryColor: (color: string) => void;
	setContentWidth: (width: ContentWidth) => void;
	setFixedWidthMax: (width: number) => void;
	setFloatingUI: (enabled: boolean) => void;
	setBorderRadius: (radius: BorderRadius) => void;
	setShowRefreshButton: (enabled: boolean) => void;
	setShowCollapseButton: (enabled: boolean) => void;
	setMenuCollapsed: (collapsed: boolean) => void;
	setActiveTopMenuKey: (key: string) => void;
	setShowHeaderButtons: (enabled: boolean) => void;
	setShowTabs: (enabled: boolean) => void;
	setTabsStyle: (style: TabsStyle) => void;
	addTab: (tab: TabItem) => TabMutationResult;
	removeTab: (key: string) => TabMutationResult;
	closeTabsLeft: (key: string) => TabMutationResult;
	closeTabsRight: (key: string) => TabMutationResult;
	closeOtherTabs: (key: string) => TabMutationResult;
	setActiveTabKey: (key: string) => void;
	pinTab: (key: string) => void;
	unpinTab: (key: string) => void;
	setImmersiveMode: (enabled: boolean) => void;
	setShowContentBackground: (enabled: boolean) => void;
	setEnableCompactMode: (enabled: boolean) => void;
	setEnablePageTransition: (enabled: boolean) => void;
	setPageTransitionType: (type: PageTransitionType) => void;
	setPageTransitionDuration: (duration: number) => void;
	setEnablePageCache: (enabled: boolean) => void;
	addPageToCache: (path: string) => void;
	removePageFromCache: (path: string) => void;
	clearAllCache: () => void;
	clearAllTabsAndCache: () => void;
	setSidebarToolbar: (enabled: boolean) => void;
	resetToDefaults: () => void;
}

export interface SystemState extends SystemPreferences, SystemPreferencesActions {
	isDark: boolean;
}
