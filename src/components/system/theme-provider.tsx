import { ProConfigProvider } from '@ant-design/pro-components';
import { App, ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { getAntdLocale, getProComponentsIntl } from '@/locales';
import type { Locale } from '@/store';
import { useSystemStore } from '@/store';

/**
 * 主题提供者组件 - 使用 Ant Design V6 零运行时模式和纯 CSS Variables
 */
function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { isDark, primaryColor, borderRadius, locale, enableCompactMode } = useSystemStore();

	// 辅助函数：调整颜色亮度
	const adjustColor = (color: string, amount: number): string => {
		const num = Number.parseInt(color.replace('#', ''), 16);
		const r = Math.max(0, Math.min(255, (num >> 16) + amount));
		const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
		const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	};

	// 辅助函数：hex 转 rgba
	const hexToRgba = (hex: string, alpha: number): string => {
		const num = Number.parseInt(hex.replace('#', ''), 16);
		const r = (num >> 16) & 255;
		const g = (num >> 8) & 255;
		const b = num & 255;
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	// 监听主题变化并更新 CSS 变量
	// biome-ignore lint/correctness/useExhaustiveDependencies: adjustColor 和 hexToRgba 是组件内定义的工具函数，无需作为依赖项
	useEffect(() => {
		if (typeof document !== 'undefined') {
			const root = document.documentElement;

			// V6 零运行时模式需要设置数据属性来控制深色主题
			// 设置深浅模式数据属性
			root.setAttribute('data-theme', isDark ? 'dark' : 'light');

			// 同时保留 dark 类用于 Tailwind CSS
			if (isDark) {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}

			// 设置 CSS 变量值 - V6 使用纯 CSS Variables
			// 主色系统
			root.style.setProperty('--ant-primary-color', primaryColor);
			root.style.setProperty('--ant-primary-color-hover', adjustColor(primaryColor, 10));
			root.style.setProperty('--ant-primary-color-active', adjustColor(primaryColor, -10));
			root.style.setProperty('--ant-primary-color-bg', hexToRgba(primaryColor, 0.1));

			// 边框圆角 - 根据用户设置的圆角档位
			root.style.setProperty('--ant-border-radius', `${borderRadius}px`);
			root.style.setProperty('--ant-border-radius-lg', `${Math.max(borderRadius + 4, borderRadius)}px`);
			root.style.setProperty('--ant-border-radius-sm', `${Math.max(borderRadius - 2, 2)}px`);

			// 菜单项圆角（根据系统设置的圆角档位）
			root.style.setProperty('--menu-item-border-radius', `${borderRadius}px`);

			// 字体大小
			root.style.setProperty('--ant-font-size', '14px');
			root.style.setProperty('--ant-font-size-lg', '16px');
			root.style.setProperty('--ant-font-size-sm', '12px');

			// 控件高度
			root.style.setProperty('--ant-control-height', '32px');
			root.style.setProperty('--ant-control-height-lg', '40px');
			root.style.setProperty('--ant-control-height-sm', '24px');

			// 间距
			root.style.setProperty('--ant-padding', '16px');
			root.style.setProperty('--ant-padding-lg', '24px');
			root.style.setProperty('--ant-padding-sm', '12px');
			root.style.setProperty('--ant-padding-xs', '8px');

			// 线条高度
			root.style.setProperty('--ant-line-height', '1.5714');

			// 动画持续时间
			root.style.setProperty('--ant-motion-duration-fast', '0.1s');
			root.style.setProperty('--ant-motion-duration-mid', '0.3s');
			root.style.setProperty('--ant-motion-duration-slow', '0.5s');

			// V6 深色主题需要特定的 CSS 变量来覆盖默认值
			if (isDark) {
				// 深色主题的颜色变量
				root.style.setProperty('--ant-color-bg', '#141414');
				root.style.setProperty('--ant-color-bg-container', '#1f1f1f');
				root.style.setProperty('--ant-color-bg-elevated', '#262626');
				root.style.setProperty('--ant-color-bg-layout', '#000000');
				root.style.setProperty('--ant-color-text', 'rgba(255, 255, 255, 0.88)');
				root.style.setProperty('--ant-color-text-secondary', 'rgba(255, 255, 255, 0.65)');
				root.style.setProperty('--ant-color-text-tertiary', 'rgba(255, 255, 255, 0.45)');
				root.style.setProperty('--ant-color-text-quaternary', 'rgba(255, 255, 255, 0.25)');
				root.style.setProperty('--ant-color-text-disabled', 'rgba(255, 255, 255, 0.25)');
				root.style.setProperty('--ant-color-border', '#434343');
				root.style.setProperty('--ant-color-border-secondary', '#303030');
				root.style.setProperty('--ant-color-fill', 'rgba(255, 255, 255, 0.08)');
				root.style.setProperty('--ant-color-fill-secondary', 'rgba(255, 255, 255, 0.06)');
				root.style.setProperty('--ant-color-fill-tertiary', 'rgba(255, 255, 255, 0.04)');
				root.style.setProperty('--ant-color-split', '#303030');
			} else {
				// 浅色主题的颜色变量（恢复默认值）
				root.style.setProperty('--ant-color-bg', '#ffffff');
				root.style.setProperty('--ant-color-bg-container', '#ffffff');
				root.style.setProperty('--ant-color-bg-elevated', '#ffffff');
				root.style.setProperty('--ant-color-bg-layout', '#f5f5f5');
				root.style.setProperty('--ant-color-text', 'rgba(0, 0, 0, 0.88)');
				root.style.setProperty('--ant-color-text-secondary', 'rgba(0, 0, 0, 0.65)');
				root.style.setProperty('--ant-color-text-tertiary', 'rgba(0, 0, 0, 0.45)');
				root.style.setProperty('--ant-color-text-quaternary', 'rgba(0, 0, 0, 0.25)');
				root.style.setProperty('--ant-color-text-disabled', 'rgba(0, 0, 0, 0.25)');
				root.style.setProperty('--ant-color-border', '#d9d9d9');
				root.style.setProperty('--ant-color-border-secondary', '#f0f0f0');
				root.style.setProperty('--ant-color-fill', 'rgba(0, 0, 0, 0.06)');
				root.style.setProperty('--ant-color-fill-secondary', 'rgba(0, 0, 0, 0.04)');
				root.style.setProperty('--ant-color-fill-tertiary', 'rgba(0, 0, 0, 0.02)');
				root.style.setProperty('--ant-color-split', '#f0f0f0');
			}
		}
	}, [isDark, primaryColor, borderRadius]);

	// Ant Design V6 零运行时配置
	const antdTheme = {
		// V6 默认启用零运行时模式，不再需要算法
		token: {
			// 主色 - 仅用于生成 CSS 变量的基准值
			colorPrimary: primaryColor,
			borderRadius: borderRadius,
		},
		// 组件配置在 V6 中主要用于 CSS 变量前缀
		components: {
			Button: {
				borderRadius: borderRadius,
				controlHeight: 36,
			},
			Input: {
				borderRadius: borderRadius,
				controlHeight: 36,
			},
			Card: {
				borderRadius: Math.max(borderRadius + 4, borderRadius),
			},
			Modal: {
				borderRadius: Math.max(borderRadius + 4, borderRadius),
			},
			Table: {
				borderRadius: borderRadius,
			},
		},
	};

	return (
		<ConfigProvider
			locale={getAntdLocale(locale as Locale)}
			theme={{
				...antdTheme,
				algorithm: enableCompactMode
					? [isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, theme.compactAlgorithm]
					: [isDark ? theme.darkAlgorithm : theme.defaultAlgorithm],
				cssVar: {
					prefix: 'ant', // CSS 变量前缀
				},
				// V6 零运行时模式
				zeroRuntime: true,
			}}
		>
			<ProConfigProvider intl={getProComponentsIntl(locale as Locale)}>
				<App>
					<div className="ant-design-root" data-theme={isDark ? 'dark' : 'light'}>
						{children}
					</div>
				</App>
			</ProConfigProvider>
		</ConfigProvider>
	);
}

export default ThemeProvider;
