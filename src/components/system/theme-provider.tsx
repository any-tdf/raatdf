import { ProConfigProvider } from '@ant-design/pro-components';
import { App, ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

import { getAntdLocale, getProComponentsIntl } from '@/locales';
import { ThemeMode, useSystemStore } from '@/store';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const { isDark, primaryColor, borderRadius, locale, enableCompactMode } = useSystemStore();

	useEffect(() => {
		const root = document.documentElement;
		root.dataset.theme = isDark ? 'dark' : 'light';
		root.classList.toggle('dark', isDark);
		root.style.setProperty('--menu-item-border-radius', `${borderRadius}px`);
	}, [borderRadius, isDark]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemThemeChange = () => {
			const state = useSystemStore.getState();
			if (state.themeMode === ThemeMode.SYSTEM) {
				state.setThemeMode(ThemeMode.SYSTEM);
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);
		return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
	}, []);

	const baseAlgorithm = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;

	return (
		<ConfigProvider
			locale={getAntdLocale(locale)}
			theme={{
				algorithm: enableCompactMode ? [baseAlgorithm, theme.compactAlgorithm] : [baseAlgorithm],
				cssVar: { prefix: 'ant' },
				zeroRuntime: true,
				token: {
					colorPrimary: primaryColor,
					borderRadius,
				},
				components: {
					Button: { borderRadius, controlHeight: 36 },
					Input: { borderRadius, controlHeight: 36 },
					Card: { borderRadius: Math.max(borderRadius + 4, borderRadius) },
					Modal: { borderRadius: Math.max(borderRadius + 4, borderRadius) },
					Table: { borderRadius },
				},
			}}
		>
			<ProConfigProvider intl={getProComponentsIntl(locale)}>
				<App>
					<div className="ant-design-root" data-theme={isDark ? 'dark' : 'light'}>
						{children}
					</div>
				</App>
			</ProConfigProvider>
		</ConfigProvider>
	);
};

export default ThemeProvider;
