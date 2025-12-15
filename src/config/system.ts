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
import type {
	BorderRadius,
	ContentWidth,
	MenuLayout,
	PageTransitionType,
	SystemPreferences,
	TabsStyle,
	ThemeMode,
} from '@/store';
import { useSystemStore } from '@/store';
import type { Locale } from '@/store/types';

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
 * 系统默认配置值集合
 * 所有配置项的默认值都定义在这里
 */
export const SYSTEM_DEFAULTS = {
	/**
	 * 主题相关配置
	 */
	theme: {
		/** 主题模式 - 默认跟随系统偏好 */
		themeMode: 'system' as ThemeMode,

		/** 主题色 - Ant Design 默认蓝色 */
		primaryColor: '#1677ff',
	},

	/**
	 * 布局相关配置
	 */
	layout: {
		/** 菜单布局方式 - 垂直侧边栏 */
		menuLayout: 'vertical' as MenuLayout,

		/** 内容区域宽度模式 - 全宽自适应 */
		contentWidth: 'full' as ContentWidth,

		/**
		 * 定宽布局的最大宽度（像素）
		 * 仅在 contentWidth === 'fixed' 时有效
		 */
		fixedWidthMax: 1200,

		/**
		 * 是否启用悬浮式界面
		 * true: 现代悬浮设计，元素带圆角和阴影
		 * false: 经典固定式布局
		 */
		enableFloatingUI: true,

		/**
		 * 界面圆角大小（像素）
		 * 支持：0, 2, 4, 6, 8, 12, 16, 20, 24
		 * 默认：8px
		 */
		borderRadius: 8 as BorderRadius,
	},

	/**
	 * 界面显示相关配置
	 */
	display: {
		/**
		 * 是否显示刷新按钮
		 * 在头部显示页面刷新按钮
		 */
		enableRefreshButton: true,

		/**
		 * 是否显示菜单折叠按钮
		 * 在头部显示菜单折叠/展开控制按钮
		 */
		enableCollapseButton: true,

		/**
		 * 是否显示顶部按钮
		 * 控制通知、聊天等额外功能按钮的显示
		 * 设置和头像始终显示
		 */
		enableHeaderButtons: true,

		/**
		 * 菜单初始折叠状态
		 * 仅在不显示折叠按钮时在设置中控制
		 */
		menuCollapsed: false,

		/**
		 * 是否启用多标签页功能
		 * 启用时在头部显示标签栏显示多个打开的页面
		 */
		enableTabs: true,

		/**
		 * 是否启用沉浸模式
		 * 启用时隐藏导航栏和其他 UI 元素，仅显示页面内容
		 */
		enableImmersiveMode: false,

		/**
		 * 是否显示卡片容器（内容区域背景色）
		 * true: 内容区域显示卡片容器，有背景色、内边距和圆角
		 * false: 内容区域透明，无背景、内边距和圆角
		 */
		enableCardContainer: true,

		/**
		 * 是否启用紧凑模式
		 * true: 全局使用紧凑布局，控件高度更小，间距更紧凑
		 * false: 使用正常尺寸布局
		 */
		enableCompactMode: false,

		/**
		 * 是否将工具栏放置在侧边栏底部
		 * true: 头像、设置等按钮显示在左侧菜单底部
		 * false: 显示在头部右侧（默认）
		 * 注意：仅在垂直布局时有效
		 */
		sidebarToolbar: false,
	},

	/**
	 * 标签页相关配置
	 */
	tabs: {
		/**
		 * 标签页显示样式
		 * 仅在启用多标签页时有效
		 */
		tabsStyle: 'default' as TabsStyle,

		/**
		 * 最大标签页数量
		 * 超过此数量后，将自动关闭最早打开的标签页
		 */
		maxTabsCount: 16,
	},

	/**
	 * 动画相关配置
	 */
	animation: {
		/**
		 * 是否启用页面切换动画
		 * 页面之间切换时是否显示过渡动画
		 */
		enablePageTransition: true,

		/**
		 * 页面切换动画类型
		 * 仅在启用页面切换动画时有效
		 */
		pageTransitionType: 'slideLeft' as PageTransitionType,

		/**
		 * 页面切换动画持续时间（毫秒）
		 * 仅在启用页面切换动画时有效
		 */
		pageTransitionDuration: 300,
	},

	/**
	 * 页面缓存相关配置
	 */
	cache: {
		/**
		 * 是否启用页面缓存
		 * 启用后，切换标签页时不会重新加载页面状态
		 */
		enablePageCache: false,
	},
} as const;

/**
 * 系统配置项的类型定义
 */
export type SystemDefaultsConfig = typeof SYSTEM_DEFAULTS;

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
