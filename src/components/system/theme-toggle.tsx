import { Button, Tooltip } from 'antd';
import { ThemeMode, useSystemStore } from '@/store';

/**
 * 主题切换组件
 */
function ThemeToggle() {
	const { themeMode, toggleTheme } = useSystemStore();

	// 获取主题图标
	const getThemeIcon = () => {
		switch (themeMode) {
			case ThemeMode.DARK:
				return 'ri-moon-line';
			case ThemeMode.LIGHT:
				return 'ri-sun-line';
			case ThemeMode.SYSTEM:
				return 'ri-computer-line';
			default:
				return 'ri-computer-line';
		}
	};

	// 获取主题标签
	const getThemeLabel = () => {
		switch (themeMode) {
			case ThemeMode.DARK:
				return '深色模式';
			case ThemeMode.LIGHT:
				return '浅色模式';
			default:
				return '跟随系统';
		}
	};

	return (
		<Tooltip title={`当前主题：${getThemeLabel()}`}>
			<Button
				type="text"
				icon={<i className={`${getThemeIcon()} text-lg`} />}
				onClick={toggleTheme}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '40px',
					height: '40px',
				}}
			/>
		</Tooltip>
	);
}

export default ThemeToggle;
