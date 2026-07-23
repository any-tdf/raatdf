import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SYSTEM_DEFAULTS } from '@/config/system-defaults';
import type { Locale } from '@/locales';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/locales';
import type { CachedPageItem, SystemState, TabItem, TabMutationResult } from '@/store/types';
import {
	type BorderRadius,
	type ContentWidth,
	type MenuLayout,
	type PageTransitionType,
	type TabsStyle,
	ThemeMode,
} from '@/store/types';

const SYSTEM_STORAGE_KEY = 'app-system-preferences';
const SYSTEM_STORAGE_VERSION = 2;

const getBrowserLocale = (): Locale => {
	if (typeof navigator === 'undefined') {
		return DEFAULT_LOCALE;
	}

	for (const browserLanguage of navigator.languages || [navigator.language]) {
		const fullMatch = SUPPORTED_LOCALES.find((locale) => locale.value.toLowerCase() === browserLanguage.toLowerCase());
		if (fullMatch) {
			return fullMatch.value;
		}

		const prefix = browserLanguage.split('-')[0].toLowerCase();
		const prefixMatch = SUPPORTED_LOCALES.find((locale) => locale.value.split('-')[0].toLowerCase() === prefix);
		if (prefixMatch) {
			return prefixMatch.value;
		}
	}

	return DEFAULT_LOCALE;
};

const getSystemTheme = (): boolean =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const calculateIsDark = (mode: ThemeMode): boolean => {
	if (mode === ThemeMode.DARK) return true;
	if (mode === ThemeMode.LIGHT) return false;
	return getSystemTheme();
};

const defaultPreferences = {
	locale: getBrowserLocale(),
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
	activeTopMenuKey: 'dashboard',
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

const manageCacheWithLRU = (cachedPages: CachedPageItem[], path: string): CachedPageItem[] => {
	const current = cachedPages.filter((item) => item.path !== path);
	return [...current, { path, lastAccessTime: Date.now() }];
};

const canRemoveTab = (tab: TabItem): boolean => !tab.pinned && tab.closable !== false;

const getMutationResult = (activePath: string | undefined): TabMutationResult => ({ activePath: activePath ?? null });

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeTabs = (value: unknown): TabItem[] => {
	if (!Array.isArray(value)) return [];

	return value.flatMap((item) => {
		if (!isRecord(item) || typeof item.key !== 'string') return [];
		return [
			{
				key: item.key,
				label: typeof item.label === 'string' ? item.label : '',
				icon: typeof item.icon === 'string' ? item.icon : undefined,
				closable: typeof item.closable === 'boolean' ? item.closable : true,
				pinned: typeof item.pinned === 'boolean' ? item.pinned : false,
			},
		];
	});
};

const sanitizePersistedState = (value: unknown): Partial<SystemState> => {
	if (!isRecord(value)) return {};
	const state: Partial<SystemState> = {};
	const booleanKeys = [
		'isFloatingUI',
		'showRefreshButton',
		'showCollapseButton',
		'menuCollapsed',
		'showHeaderButtons',
		'showTabs',
		'isImmersiveMode',
		'showContentBackground',
		'enableCompactMode',
		'enablePageTransition',
		'enablePageCache',
		'sidebarToolbar',
	] as const;

	for (const key of booleanKeys) {
		if (typeof value[key] === 'boolean') {
			(state as Record<string, unknown>)[key] = value[key];
		}
	}

	if (SUPPORTED_LOCALES.some((locale) => locale.value === value.locale)) state.locale = value.locale as Locale;
	if (['system', 'light', 'dark'].includes(String(value.themeMode))) state.themeMode = value.themeMode as ThemeMode;
	if (['vertical', 'horizontal', 'mixed', 'double-column'].includes(String(value.menuLayout))) {
		state.menuLayout = value.menuLayout as MenuLayout;
	}
	if (['full', 'fixed'].includes(String(value.contentWidth))) state.contentWidth = value.contentWidth as ContentWidth;
	if (['default', 'button', 'simple', 'card'].includes(String(value.tabsStyle)))
		state.tabsStyle = value.tabsStyle as TabsStyle;
	if (['none', 'fade', 'slideLeft', 'slideUp', 'slideDown', 'scale'].includes(String(value.pageTransitionType))) {
		state.pageTransitionType = value.pageTransitionType as PageTransitionType;
	}
	if (typeof value.primaryColor === 'string' && /^#[\da-f]{6}$/i.test(value.primaryColor)) {
		state.primaryColor = value.primaryColor;
	}
	if (typeof value.fixedWidthMax === 'number' && value.fixedWidthMax >= 600 && value.fixedWidthMax <= 2400) {
		state.fixedWidthMax = value.fixedWidthMax;
	}
	if ([0, 2, 4, 6, 8, 12, 16, 20, 24].includes(Number(value.borderRadius))) {
		state.borderRadius = value.borderRadius as BorderRadius;
	}
	if (typeof value.pageTransitionDuration === 'number' && value.pageTransitionDuration >= 0) {
		state.pageTransitionDuration = value.pageTransitionDuration;
	}
	if (typeof value.activeTopMenuKey === 'string' && value.activeTopMenuKey) {
		state.activeTopMenuKey = value.activeTopMenuKey;
	}

	const tabs = sanitizeTabs(value.tabs);
	state.tabs = tabs;
	state.activeTabKey =
		typeof value.activeTabKey === 'string' && tabs.some((tab) => tab.key === value.activeTabKey)
			? value.activeTabKey
			: (tabs[0]?.key ?? '');
	state.cachedPages = [];
	return state;
};

export const useSystemStore = create<SystemState>()(
	persist(
		(set, get) => ({
			...defaultPreferences,
			isDark: calculateIsDark(defaultPreferences.themeMode),
			setLocale: (locale) => set({ locale }),
			setThemeMode: (themeMode) => set({ themeMode, isDark: calculateIsDark(themeMode) }),
			toggleTheme: () => {
				const nextMode =
					get().themeMode === ThemeMode.SYSTEM
						? ThemeMode.LIGHT
						: get().themeMode === ThemeMode.LIGHT
							? ThemeMode.DARK
							: ThemeMode.SYSTEM;
				get().setThemeMode(nextMode);
			},
			setMenuLayout: (menuLayout) => set({ menuLayout }),
			setPrimaryColor: (primaryColor) => set({ primaryColor }),
			setContentWidth: (contentWidth) => set({ contentWidth }),
			setFixedWidthMax: (fixedWidthMax) => set({ fixedWidthMax }),
			setFloatingUI: (isFloatingUI) => set({ isFloatingUI }),
			setBorderRadius: (borderRadius) => set({ borderRadius }),
			setShowRefreshButton: (showRefreshButton) => set({ showRefreshButton }),
			setShowCollapseButton: (showCollapseButton) => set({ showCollapseButton }),
			setMenuCollapsed: (menuCollapsed) => set({ menuCollapsed }),
			setActiveTopMenuKey: (activeTopMenuKey) => set({ activeTopMenuKey }),
			setShowHeaderButtons: (showHeaderButtons) => set({ showHeaderButtons }),
			setShowTabs: (showTabs) =>
				set(showTabs ? { showTabs } : { showTabs, tabs: [], activeTabKey: '', cachedPages: [] }),
			setTabsStyle: (tabsStyle) => set({ tabsStyle }),
			addTab: (tab) => {
				const state = get();
				const existing = state.tabs.find((item) => item.key === tab.key);
				if (existing) {
					set({ activeTabKey: tab.key });
					return getMutationResult(tab.key);
				}

				let tabs = [...state.tabs, tab];
				let cachedPages = state.cachedPages;
				if (tabs.length > SYSTEM_DEFAULTS.tabs.maxTabsCount) {
					const removableTabs = tabs.filter((item) => item.key !== tab.key && canRemoveTab(item));
					const removalTarget = removableTabs.sort((left, right) => {
						const leftTime = cachedPages.find((item) => item.path === left.key)?.lastAccessTime ?? tabs.indexOf(left);
						const rightTime =
							cachedPages.find((item) => item.path === right.key)?.lastAccessTime ?? tabs.indexOf(right);
						return leftTime - rightTime;
					})[0];
					if (removalTarget) {
						tabs = tabs.filter((item) => item.key !== removalTarget.key);
						cachedPages = cachedPages.filter((item) => item.path !== removalTarget.key);
					}
				}

				set({ tabs, activeTabKey: tab.key, cachedPages });
				return getMutationResult(tab.key);
			},
			removeTab: (key) => {
				const state = get();
				const targetIndex = state.tabs.findIndex((tab) => tab.key === key);
				const target = state.tabs[targetIndex];
				if (!target || !canRemoveTab(target)) return getMutationResult(state.activeTabKey);

				const tabs = state.tabs.filter((tab) => tab.key !== key);
				if (!tabs.length) return getMutationResult(state.activeTabKey);
				const activeTabKey =
					state.activeTabKey === key
						? (tabs[Math.min(targetIndex, tabs.length - 1)]?.key ?? tabs[0].key)
						: state.activeTabKey;
				set({
					tabs,
					activeTabKey,
					cachedPages: state.cachedPages.filter((item) => item.path !== key),
				});
				return getMutationResult(activeTabKey);
			},
			closeTabsLeft: (key) => {
				const state = get();
				const targetIndex = state.tabs.findIndex((tab) => tab.key === key);
				if (targetIndex < 0) return getMutationResult(state.activeTabKey);
				const removedKeys = new Set(
					state.tabs
						.slice(0, targetIndex)
						.filter(canRemoveTab)
						.map((tab) => tab.key)
				);
				const tabs = state.tabs.filter((tab) => !removedKeys.has(tab.key));
				const activeTabKey = removedKeys.has(state.activeTabKey) ? key : state.activeTabKey;
				set({ tabs, activeTabKey, cachedPages: state.cachedPages.filter((item) => !removedKeys.has(item.path)) });
				return getMutationResult(activeTabKey);
			},
			closeTabsRight: (key) => {
				const state = get();
				const targetIndex = state.tabs.findIndex((tab) => tab.key === key);
				if (targetIndex < 0) return getMutationResult(state.activeTabKey);
				const removedKeys = new Set(
					state.tabs
						.slice(targetIndex + 1)
						.filter(canRemoveTab)
						.map((tab) => tab.key)
				);
				const tabs = state.tabs.filter((tab) => !removedKeys.has(tab.key));
				const activeTabKey = removedKeys.has(state.activeTabKey) ? key : state.activeTabKey;
				set({ tabs, activeTabKey, cachedPages: state.cachedPages.filter((item) => !removedKeys.has(item.path)) });
				return getMutationResult(activeTabKey);
			},
			closeOtherTabs: (key) => {
				const state = get();
				if (!state.tabs.some((tab) => tab.key === key)) return getMutationResult(state.activeTabKey);
				const removedKeys = new Set(
					state.tabs.filter((tab) => tab.key !== key && canRemoveTab(tab)).map((tab) => tab.key)
				);
				const tabs = state.tabs.filter((tab) => !removedKeys.has(tab.key));
				set({ tabs, activeTabKey: key, cachedPages: state.cachedPages.filter((item) => !removedKeys.has(item.path)) });
				return getMutationResult(key);
			},
			setActiveTabKey: (activeTabKey) => set({ activeTabKey }),
			pinTab: (key) =>
				set((state) => ({
					tabs: [
						...state.tabs
							.filter((tab) => tab.key === key || tab.pinned)
							.map((tab) => (tab.key === key ? { ...tab, pinned: true } : tab)),
						...state.tabs.filter((tab) => tab.key !== key && !tab.pinned),
					],
				})),
			unpinTab: (key) =>
				set((state) => ({
					tabs: state.tabs.map((tab) => (tab.key === key ? { ...tab, pinned: false } : tab)),
				})),
			setImmersiveMode: (isImmersiveMode) => set({ isImmersiveMode }),
			setShowContentBackground: (showContentBackground) => set({ showContentBackground }),
			setEnableCompactMode: (enableCompactMode) => set({ enableCompactMode }),
			setEnablePageTransition: (enablePageTransition) => set({ enablePageTransition }),
			setPageTransitionType: (pageTransitionType) => set({ pageTransitionType }),
			setPageTransitionDuration: (pageTransitionDuration) => set({ pageTransitionDuration }),
			setEnablePageCache: (enablePageCache) =>
				set(enablePageCache ? { enablePageCache } : { enablePageCache, cachedPages: [] }),
			addPageToCache: (path) => {
				if (get().enablePageCache) set({ cachedPages: manageCacheWithLRU(get().cachedPages, path) });
			},
			removePageFromCache: (path) => set({ cachedPages: get().cachedPages.filter((item) => item.path !== path) }),
			clearAllCache: () => set({ cachedPages: [] }),
			clearAllTabsAndCache: () => set({ tabs: [], activeTabKey: '', cachedPages: [] }),
			setSidebarToolbar: (sidebarToolbar) => set({ sidebarToolbar }),
			resetToDefaults: () => set({ ...defaultPreferences, isDark: calculateIsDark(defaultPreferences.themeMode) }),
		}),
		{
			name: SYSTEM_STORAGE_KEY,
			storage: createJSONStorage(() => window.localStorage),
			version: SYSTEM_STORAGE_VERSION,
			partialize: (state) => ({
				...sanitizePersistedState(state),
				tabs: state.tabs.map(({ key, icon, closable, pinned }) => ({ key, icon, closable, pinned, label: '' })),
				activeTabKey: state.activeTabKey,
				cachedPages: [],
			}),
			migrate: (persistedState) => ({
				...sanitizePersistedState(persistedState),
				tabs: [],
				activeTabKey: '',
				cachedPages: [],
			}),
			merge: (persistedState, currentState) => {
				const persisted = sanitizePersistedState(persistedState);
				const themeMode = persisted.themeMode ?? currentState.themeMode;
				return { ...currentState, ...persisted, isDark: calculateIsDark(themeMode), cachedPages: [] };
			},
		}
	)
);
