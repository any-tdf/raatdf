import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SYSTEM_DEFAULTS } from '@/config/system';
import type { Locale } from '@/locales';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/locales';
import type { CachedPageItem, MenuItem, SystemState, TabItem } from '@/store/types';
import {
	type BorderRadius,
	type ContentWidth,
	type MenuLayout,
	type PageTransitionType,
	type TabsStyle,
	ThemeMode,
} from '@/store/types';

const SYSTEM_STORAGE_KEY = 'app-system-preferences';

/**
 * 获取浏览器语言设置，并映射到支持的语言
 * 优先级：完全匹配 > 语言前缀匹配 > 默认语言
 */
const getBrowserLocale = (): Locale => {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return DEFAULT_LOCALE;
	}

	const browserLanguages = navigator.languages || [navigator.language];

	// 遍历浏览器语言优先级列表，查找支持的语言
	for (const browserLang of browserLanguages) {
		// 完全匹配（如 zh-CN）
		const fullMatch = SUPPORTED_LOCALES.find((locale) => locale.value.toLowerCase() === browserLang.toLowerCase());
		if (fullMatch) {
			return fullMatch.value;
		}

		// 语言前缀匹配（如 zh-* 匹配 zh-CN）
		const langPrefix = browserLang.split('-')[0].toLowerCase();
		const prefixMatch = SUPPORTED_LOCALES.find((locale) => locale.value.split('-')[0].toLowerCase() === langPrefix);
		if (prefixMatch) {
			return prefixMatch.value;
		}
	}

	return DEFAULT_LOCALE;
};

/**
 * 获取系统主题偏好
 */
const getSystemTheme = (): boolean => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * 根据主题模式计算实际是否为深色模式
 */
const calculateIsDark = (mode: ThemeMode): boolean => {
	switch (mode) {
		case ThemeMode.DARK:
			return true;
		case ThemeMode.LIGHT:
			return false;
		default:
			return getSystemTheme();
	}
};

/**
 * 默认系统偏好设置
 * 所有字段值来自 src/config/system.ts 的 SYSTEM_DEFAULTS
 */
const defaultPreferences = {
	locale: DEFAULT_LOCALE,
	themeMode: SYSTEM_DEFAULTS.theme.themeMode as ThemeMode,
	primaryColor: SYSTEM_DEFAULTS.theme.primaryColor,
	menuLayout: SYSTEM_DEFAULTS.layout.menuLayout,
	contentWidth: SYSTEM_DEFAULTS.layout.contentWidth,
	fixedWidthMax: SYSTEM_DEFAULTS.layout.fixedWidthMax,
	isFloatingUI: SYSTEM_DEFAULTS.layout.enableFloatingUI,
	borderRadius: SYSTEM_DEFAULTS.layout.borderRadius,
	showRefreshButton: SYSTEM_DEFAULTS.display.enableRefreshButton,
	showCollapseButton: SYSTEM_DEFAULTS.display.enableCollapseButton,
	menuCollapsed: SYSTEM_DEFAULTS.display.menuCollapsed,
	showHeaderButtons: SYSTEM_DEFAULTS.display.enableHeaderButtons,
	showTabs: SYSTEM_DEFAULTS.display.enableTabs,
	tabsStyle: SYSTEM_DEFAULTS.tabs.tabsStyle,
	tabs: [] as TabItem[],
	activeTabKey: '',
	isImmersiveMode: SYSTEM_DEFAULTS.display.enableImmersiveMode,
	showContentBackground: SYSTEM_DEFAULTS.display.enableCardContainer,
	enableCompactMode: SYSTEM_DEFAULTS.display.enableCompactMode,
	enablePageTransition: SYSTEM_DEFAULTS.animation.enablePageTransition,
	pageTransitionType: SYSTEM_DEFAULTS.animation.pageTransitionType as PageTransitionType,
	pageTransitionDuration: SYSTEM_DEFAULTS.animation.pageTransitionDuration,
	enablePageCache: SYSTEM_DEFAULTS.cache.enablePageCache,
	cachedPages: [] as CachedPageItem[],
	sidebarToolbar: SYSTEM_DEFAULTS.display.sidebarToolbar,
};

/**
 * LRU 缓存管理：添加或更新页面缓存
 */
const manageCacheWithLRU = (cachedPages: CachedPageItem[], newPath: string): CachedPageItem[] => {
	const now = Date.now();
	const existingIndex = cachedPages.findIndex((item) => item.path === newPath);

	if (existingIndex !== -1) {
		// 已缓存，更新访问时间并移到队尾
		const updatedPages = [...cachedPages];
		updatedPages[existingIndex] = { path: newPath, lastAccessTime: now };
		const [item] = updatedPages.splice(existingIndex, 1);
		updatedPages.push(item);
		return updatedPages;
	}

	// 未缓存，添加到队尾
	return [...cachedPages, { path: newPath, lastAccessTime: now }];
};

/**
 * 系统偏好设置状态管理 Store
 */
export const useSystemStore = create<SystemState>()(
	persist(
		(set, get) => ({
			// 初始状态
			...defaultPreferences,
			isDark: calculateIsDark(defaultPreferences.themeMode),

			// 设置界面语言
			setLocale: (locale: Locale) => {
				set({ locale });
			},

			// 设置主题模式
			setThemeMode: (themeMode: ThemeMode) => {
				const isDark = calculateIsDark(themeMode);
				set({ themeMode, isDark });
			},

			// 切换主题模式（在系统、浅色、深色之间循环）
			toggleTheme: () => {
				const { themeMode } = get();
				let newMode: ThemeMode;

				// 在系统、浅色、深色之间循环切换
				switch (themeMode) {
					case ThemeMode.SYSTEM:
						newMode = ThemeMode.LIGHT;
						break;
					case ThemeMode.LIGHT:
						newMode = ThemeMode.DARK;
						break;
					default:
						newMode = ThemeMode.SYSTEM;
						break;
				}

				get().setThemeMode(newMode);
			},

			// 设置菜单布局
			setMenuLayout: (menuLayout: MenuLayout) => {
				set({ menuLayout });
			},

			// 设置主题色
			setPrimaryColor: (primaryColor: string) => {
				set({ primaryColor });
			},

			// 设置内容宽度
			setContentWidth: (contentWidth: ContentWidth) => {
				set({ contentWidth });
			},

			// 设置定宽布局的最大宽度
			setFixedWidthMax: (fixedWidthMax: number) => {
				set({ fixedWidthMax });
			},

			// 设置悬浮式界面
			setFloatingUI: (isFloatingUI: boolean) => {
				set({ isFloatingUI });
			},

			// 设置界面圆角
			setBorderRadius: (borderRadius: BorderRadius) => {
				set({ borderRadius });
			},

			// 设置是否显示刷新按钮
			setShowRefreshButton: (showRefreshButton: boolean) => {
				set({ showRefreshButton });
			},

			// 设置是否显示折叠菜单按钮
			setShowCollapseButton: (showCollapseButton: boolean) => {
				set({ showCollapseButton });
			},

			// 设置菜单折叠状态
			setMenuCollapsed: (menuCollapsed: boolean) => {
				set({ menuCollapsed });
			},

			// 设置是否显示头部按钮
			setShowHeaderButtons: (showHeaderButtons: boolean) => {
				set({ showHeaderButtons });
			},

			// 设置是否显示多标签页
			setShowTabs: (showTabs: boolean) => {
				set({ showTabs });
				// 关闭多标签页时清理缓存
				if (!showTabs) {
					set({ tabs: [], cachedPages: [] });
				}
			},

			// 设置标签页样式
			setTabsStyle: (tabsStyle: TabsStyle) => {
				set({ tabsStyle });
			},

			// 添加标签页
			addTab: (tab: TabItem) => {
				const { tabs, cachedPages } = get();
				// 如果标签页已存在，不重复添加
				if (tabs.find((t) => t.key === tab.key)) {
					set({ activeTabKey: tab.key });
				} else {
					let newTabs = [...tabs, tab];
					let newCachedPages = cachedPages;

					// 检查是否超过最大标签页数量
					const maxTabsCount = SYSTEM_DEFAULTS.tabs.maxTabsCount;
					if (newTabs.length > maxTabsCount) {
						// 移除最早打开的标签页（第一个）
						const removedTab = newTabs[0];
						newTabs = newTabs.slice(1);
						// 同时移除对应的缓存
						newCachedPages = cachedPages.filter((item) => item.path !== removedTab.key);
					}

					set({ tabs: newTabs, activeTabKey: tab.key, cachedPages: newCachedPages });
				}
			},

			// 移除标签页
			removeTab: (key: string) => {
				const { tabs, activeTabKey, cachedPages } = get();
				const newTabs = tabs.filter((t) => t.key !== key);
				const newCachedPages = cachedPages.filter((item) => item.path !== key);
				// 如果关闭的是当前激活的标签页，切换到最后一个
				if (activeTabKey === key && newTabs.length > 0) {
					set({ tabs: newTabs, activeTabKey: newTabs[newTabs.length - 1].key, cachedPages: newCachedPages });
				} else {
					set({ tabs: newTabs, cachedPages: newCachedPages });
				}
			},

			// 设置当前激活的标签页
			setActiveTabKey: (activeTabKey: string) => {
				set({ activeTabKey });
			},

			// 固定标签页
			pinTab: (key: string) => {
				const { tabs } = get();
				const newTabs = tabs.map((tab) => (tab.key === key ? { ...tab, pinned: true } : tab));
				// 排序：固定的标签页排在前面
				const sortedTabs = [...newTabs.filter((tab) => tab.pinned), ...newTabs.filter((tab) => !tab.pinned)];
				set({ tabs: sortedTabs });
			},

			// 取消固定标签页
			unpinTab: (key: string) => {
				const { tabs } = get();
				const newTabs = tabs.map((tab) => (tab.key === key ? { ...tab, pinned: false } : tab));
				// 排序：固定的标签页排在前面
				const sortedTabs = [...newTabs.filter((tab) => tab.pinned), ...newTabs.filter((tab) => !tab.pinned)];
				set({ tabs: sortedTabs });
			},

			// 设置沉浸模式
			setImmersiveMode: (isImmersiveMode: boolean) => {
				set({ isImmersiveMode });
			},

			// 设置内容区域是否有背景色
			setShowContentBackground: (showContentBackground: boolean) => {
				set({ showContentBackground });
			},

			// 设置是否启用紧凑模式
			setEnableCompactMode: (enableCompactMode: boolean) => {
				set({ enableCompactMode });
			},

			// 设置是否启用页面切换动画
			setEnablePageTransition: (enablePageTransition: boolean) => {
				set({ enablePageTransition });
			},

			// 设置页面切换动画类型
			setPageTransitionType: (pageTransitionType: PageTransitionType) => {
				set({ pageTransitionType });
			},

			// 设置动画持续时间
			setPageTransitionDuration: (pageTransitionDuration: number) => {
				set({ pageTransitionDuration });
			},

			// 添加页面到缓存
			addPageToCache: (path: string) => {
				const { enablePageCache, cachedPages } = get();
				if (!enablePageCache) return;
				const newCachedPages = manageCacheWithLRU(cachedPages, path);
				set({ cachedPages: newCachedPages });
			},

			// 从缓存中移除页面
			removePageFromCache: (path: string) => {
				const { cachedPages } = get();
				set({ cachedPages: cachedPages.filter((item) => item.path !== path) });
			},

			// 清空所有缓存
			clearAllCache: () => {
				set({ cachedPages: [] });
			},

			// 清空所有标签页和缓存（用于退出登录）
			clearAllTabsAndCache: () => {
				set({ tabs: [], activeTabKey: '', cachedPages: [] });
			},

			// 设置是否启用页面缓存
			setEnablePageCache: (enabled: boolean) => {
				set({ enablePageCache: enabled });
				// 关闭缓存时清空所有缓存
				if (!enabled) {
					set({ cachedPages: [] });
				}
			},

			// 设置是否将工具栏放置在侧边栏底部
			setSidebarToolbar: (sidebarToolbar: boolean) => {
				set({ sidebarToolbar });
			},

			// 重置为默认设置
			resetToDefaults: () => {
				const isDark = calculateIsDark(defaultPreferences.themeMode);
				set({ ...defaultPreferences, isDark });
			},

			// 菜单数据
			menuData: [],

			// 设置菜单数据
			setMenuData: (menuData: MenuItem[]) => {
				set({ menuData });
			},
		}),
		{
			name: SYSTEM_STORAGE_KEY,
			partialize: (state) => ({
				locale: state.locale,
				themeMode: state.themeMode,
				menuLayout: state.menuLayout,
				primaryColor: state.primaryColor,
				contentWidth: state.contentWidth,
				fixedWidthMax: state.fixedWidthMax,
				isFloatingUI: state.isFloatingUI,
				borderRadius: state.borderRadius,
				showRefreshButton: state.showRefreshButton,
				showCollapseButton: state.showCollapseButton,
				menuCollapsed: state.menuCollapsed,
				showHeaderButtons: state.showHeaderButtons,
				showTabs: state.showTabs,
				tabsStyle: state.tabsStyle,
				// 只存储标签页的 key、icon、closable、pinned，不存储 label
				// label 会在渲染时从菜单数据中动态获取，实现国际化
				tabs: state.tabs.map((tab) => ({
					key: tab.key,
					icon: tab.icon,
					closable: tab.closable,
					pinned: tab.pinned,
					label: '', // 空字符串作为占位，渲染时会从菜单数据中获取
				})),
				activeTabKey: state.activeTabKey,
				isImmersiveMode: state.isImmersiveMode,
				showContentBackground: state.showContentBackground,
				enableCompactMode: state.enableCompactMode,
				enablePageTransition: state.enablePageTransition,
				pageTransitionType: state.pageTransitionType,
				pageTransitionDuration: state.pageTransitionDuration,
				enablePageCache: state.enablePageCache,
				sidebarToolbar: state.sidebarToolbar,
				// 注意：cachedPages 不持久化，刷新页面后从空列表开始
			}),
			onRehydrateStorage: () => (state) => {
				// 如果本地没有缓存（首次打开应用），使用浏览器语言
				if (!state) {
					const browserLocale = getBrowserLocale();
					return {
						locale: browserLocale,
						isDark: calculateIsDark(defaultPreferences.themeMode),
					};
				}

				// 恢复状态后重新计算 isDark
				const isDark = calculateIsDark(state.themeMode);
				state.isDark = isDark;
			},
		}
	)
);

// 监听系统主题变化
if (typeof window !== 'undefined') {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const handleSystemThemeChange = () => {
		const { themeMode, setThemeMode } = useSystemStore.getState();
		// 只有在系统模式下才响应系统主题变化
		if (themeMode === ThemeMode.SYSTEM) {
			setThemeMode(ThemeMode.SYSTEM);
		}
	};

	// 添加监听器
	mediaQuery.addEventListener('change', handleSystemThemeChange);
}
