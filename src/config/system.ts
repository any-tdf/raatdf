/**
 * 系统配置文件 - 单一信息源
 *
 * 这是项目中唯一的系统配置文件，集中管理：
 * - 配置选项（CONFIG_OPTIONS）
 * - 默认值（SYSTEM_DEFAULTS）
 * - 功能开关（FEATURE_FLAGS）
 * - 工具函数（getSystemConfig、getAntdThemeConfig 等）
 *
 * 后续维护者只需修改此文件即可：
 * - 修改任意配置的默认值
 * - 关闭不需要的功能（在 FEATURE_FLAGS 中设置 enabled: false）
 * - 添加新的配置项或功能模块
 *
 * 注意：所有配置项的标签和文案都已迁移至 src/locales
 */

import { theme } from 'antd';

import { getConfigLocale } from '@/locales';
import { useSystemStore } from '@/store/system-store';
import type { SystemPreferences } from '@/store/types';
import type { Locale } from '@/store/types';

export { SYSTEM_DEFAULTS } from '@/config/system-defaults';
export type { SystemDefaultsConfig } from '@/config/system-defaults';

/**
 * 预定义主题色值映射
 * 将颜色名称映射到具体的色值
 */
const PRESET_COLOR_VALUES = {
	defaultBlue: '#1677ff',
	greenShade: '#52c41a',
	warmOrange: '#fa8c16',
	elegantPurple: '#722ed1',
	charmRed: '#eb2f96',
	calmTeal: '#13c2c2',
	verdigris: '#25a55e',
	amber: '#b45309',
	roseGold: '#b5495b',
	indigo: '#6366f1',
} as const;

/**
 * 配置项的可选值集合
 * 所有枚举型或选择型配置的可选值都定义在这里
 * @param locale 语言区域设置
 */
export const CONFIG_OPTIONS = (locale: Locale) => {
	const configLocale = getConfigLocale(locale);

	return {
		theme: {
			/** 主题模式选项 */
			modes: configLocale.theme.modes.map((mode, index) => ({
				value: (['system', 'light', 'dark'] as const)[index],
				label: mode.label,
				description: mode.description,
			})),
			/** 预定义主题色 */
			presetColors: configLocale.theme.presetColors.map((color) => ({
				label: color.label,
				value: PRESET_COLOR_VALUES[color.name as keyof typeof PRESET_COLOR_VALUES],
				name: color.name,
			})),
		},

		layout: {
			/** 菜单布局选项 */
			menuLayouts: configLocale.layout.menuLayouts,
			/** 内容宽度模式选项 */
			contentWidths: configLocale.layout.contentWidths,
			/** 界面圆角大小选项 */
			borderRadiuses: configLocale.layout.borderRadiuses,
		},

		tabs: {
			/** 标签页样式选项 */
			styles: configLocale.tabs.options,
		},

		animation: {
			/** 页面切换动画类型选项 */
			transitionTypes: configLocale.pageTransition.options,
		},
	} as const;
};

/**
 * 功能开关配置
 * 控制哪些设置项在系统设置面板中显示
 *
 * 使用方法：
 * - 设置为 true：该设置项会在设置面板中显示，用户可以修改
 * - 设置为 false：该设置项不会在设置面板中显示，将使用 SYSTEM_DEFAULTS 中的默认值
 *
 * 注意：设置为 false 不会影响功能本身，只是隐藏设置选项
 */
export const FEATURE_FLAGS = {
	/** 主题模式切换 */
	themeMode: true,
	/** 主题色选择 */
	primaryColor: true,
	/** 菜单布局 */
	menuLayout: true,
	/** 内容宽度 */
	contentWidth: true,
	/** 悬浮界面 */
	floatingUI: true,
	/** 界面圆角 */
	borderRadius: true,
	/** 界面语言设置 */
	language: true,
	/** 刷新按钮 */
	refreshButton: true,
	/** 折叠按钮 */
	collapseButton: true,
	/** 顶部按钮 */
	headerButtons: true,
	/** 沉浸模式 */
	immersiveMode: true,
	/** 卡片容器 */
	cardContainer: true,
	/** 紧凑模式 */
	compactMode: true,
	/** 侧边栏工具栏 */
	sidebarToolbar: true,
	/** 多标签页 */
	tabs: true,
	/** 标签页样式 */
	tabsStyle: true,
	/** 页面缓存 */
	pageCache: true,
	/** 页面切换动画 */
	pageTransition: true,
	/** 全屏模式 */
	fullscreen: true,
} as const;

/**
 * 功能开关配置的类型定义
 */
export type FeatureFlagsConfig = typeof FEATURE_FLAGS;

// ============================================================================
// 以下是系统配置相关的工具函数
// ============================================================================

/**
 * 获取系统配置
 */
export const getSystemConfig = (): SystemPreferences => {
	const state = useSystemStore.getState();
	return {
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
		activeTopMenuKey: state.activeTopMenuKey,
		showHeaderButtons: state.showHeaderButtons,
		showTabs: state.showTabs,
		tabsStyle: state.tabsStyle,
		isImmersiveMode: state.isImmersiveMode,
		showContentBackground: state.showContentBackground,
		enableCompactMode: state.enableCompactMode,
		tabs: state.tabs,
		activeTabKey: state.activeTabKey,
		enablePageTransition: state.enablePageTransition,
		pageTransitionType: state.pageTransitionType,
		pageTransitionDuration: state.pageTransitionDuration,
		enablePageCache: state.enablePageCache,
		cachedPages: state.cachedPages,
		locale: state.locale,
		sidebarToolbar: state.sidebarToolbar,
	};
};

/**
 * 设置系统配置
 */
export const setSystemConfig = (config: Partial<SystemPreferences>) => {
	const state = useSystemStore.getState();
	if (config.themeMode !== undefined) {
		state.setThemeMode(config.themeMode);
	}
	if (config.menuLayout !== undefined) {
		state.setMenuLayout(config.menuLayout);
	}
	if (config.primaryColor !== undefined) {
		state.setPrimaryColor(config.primaryColor);
	}
	if (config.contentWidth !== undefined) {
		state.setContentWidth(config.contentWidth);
	}
	if (config.locale !== undefined) {
		state.setLocale(config.locale);
	}
};

/**
 * 获取 Ant Design 主题算法
 */
export const getThemeAlgorithm = (themeMode: string) => {
	switch (themeMode) {
		case 'dark':
			return theme.darkAlgorithm;
		case 'light':
			return theme.defaultAlgorithm;
		default: {
			// 跟随系统
			const getSystemTheme = (): boolean => {
				if (typeof window === 'undefined') return false;
				return window.matchMedia('(prefers-color-scheme: dark)').matches;
			};
			return getSystemTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm;
		}
	}
};

/**
 * 获取 Ant Design 完整主题配置
 */
export const getAntdThemeConfig = (systemConfig: SystemPreferences) => {
	return {
		token: {
			colorPrimary: systemConfig.primaryColor,
		},
		algorithm: getThemeAlgorithm(systemConfig.themeMode),
	};
};
