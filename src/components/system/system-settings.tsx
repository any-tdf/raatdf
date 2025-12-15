/**
 * 系统设置抽屉组件
 */
import { Button, Drawer, Popconfirm } from 'antd';
import { useState } from 'react';
import { CONFIG_OPTIONS } from '@/config/system';
import { getCommonLocale } from '@/locales';
import { useSystemStore } from '@/store';
import {
	BorderRadiusSetting,
	ContentWidthSetting,
	DisplaySettings,
	LanguageSetting,
	MenuLayoutSetting,
	PrimaryColorSetting,
	ThemeModeSetting,
	useFullscreen,
	useMaxWidth,
} from './settings';

// ==================== 设置面板内容 ====================

function SettingsContent() {
	const {
		locale,
		themeMode,
		menuLayout,
		primaryColor,
		contentWidth,
		fixedWidthMax,
		isFloatingUI,
		borderRadius,
		showRefreshButton,
		showCollapseButton,
		menuCollapsed,
		showHeaderButtons,
		showTabs,
		tabsStyle,
		isImmersiveMode,
		showContentBackground,
		enableCompactMode,
		enablePageCache,
		pageTransitionType,
		sidebarToolbar,
		setThemeMode,
		setMenuLayout,
		setPrimaryColor,
		setContentWidth,
		setFixedWidthMax,
		setFloatingUI,
		setBorderRadius,
		setShowRefreshButton,
		setShowCollapseButton,
		setMenuCollapsed,
		setShowHeaderButtons,
		setShowTabs,
		setTabsStyle,
		setImmersiveMode,
		setShowContentBackground,
		setEnableCompactMode,
		setEnablePageCache,
		setPageTransitionType,
		setSidebarToolbar,
	} = useSystemStore();

	// 获取当前语言的本地化文本
	const commonLocale = getCommonLocale(locale);
	// 获取当前语言的配置选项
	const configOptions = CONFIG_OPTIONS(locale);

	// 全屏状态管理
	const { isFullscreen, toggleFullscreen } = useFullscreen();

	// 定宽布局最大宽度计算
	const maxWidthValue = useMaxWidth({
		menuLayout,
		isFloatingUI,
		showCollapseButton,
		menuCollapsed,
		fixedWidthMax,
		setFixedWidthMax,
	});

	return (
		<div className="px-1">
			{/* 主题模式设置 */}
			<ThemeModeSetting
				themeMode={themeMode}
				borderRadius={borderRadius}
				locale={commonLocale.theme}
				setThemeMode={setThemeMode}
			/>

			{/* 主题色设置 */}
			<PrimaryColorSetting
				primaryColor={primaryColor}
				borderRadius={borderRadius}
				locale={commonLocale.themeColor}
				presetColors={configOptions.theme.presetColors}
				setPrimaryColor={setPrimaryColor}
			/>

			{/* 菜单布局设置 */}
			<MenuLayoutSetting
				menuLayout={menuLayout}
				borderRadius={borderRadius}
				locale={commonLocale.layout}
				setMenuLayout={setMenuLayout}
			/>

			{/* 内容宽度设置 */}
			<ContentWidthSetting
				contentWidth={contentWidth}
				fixedWidthMax={fixedWidthMax}
				maxWidthValue={maxWidthValue}
				borderRadius={borderRadius}
				locale={commonLocale.pageWidth}
				setContentWidth={setContentWidth}
				setFixedWidthMax={setFixedWidthMax}
			/>

			{/* 语言设置 */}
			<LanguageSetting locale={locale} borderRadius={borderRadius} title={commonLocale.display.language} />

			{/* 圆角设置 */}
			<BorderRadiusSetting
				borderRadius={borderRadius}
				locale={commonLocale.borderRadius}
				marks={configOptions.layout.borderRadiuses}
				setBorderRadius={setBorderRadius}
			/>

			{/* 界面显示设置 */}
			<DisplaySettings
				isFullscreen={isFullscreen}
				isFloatingUI={isFloatingUI}
				showRefreshButton={showRefreshButton}
				showCollapseButton={showCollapseButton}
				menuCollapsed={menuCollapsed}
				showHeaderButtons={showHeaderButtons}
				isImmersiveMode={isImmersiveMode}
				showContentBackground={showContentBackground}
				enableCompactMode={enableCompactMode}
				sidebarToolbar={sidebarToolbar}
				showTabs={showTabs}
				enablePageCache={enablePageCache}
				tabsStyle={tabsStyle}
				pageTransitionType={pageTransitionType}
				menuLayout={menuLayout}
				locale={commonLocale.display}
				tabsStyleLocale={commonLocale.tabsStyle}
				pageTransitionLocale={commonLocale.pageTransition}
				tabsStyleOptions={configOptions.tabs.styles}
				transitionOptions={configOptions.animation.transitionTypes}
				toggleFullscreen={toggleFullscreen}
				setFloatingUI={setFloatingUI}
				setShowRefreshButton={setShowRefreshButton}
				setShowCollapseButton={setShowCollapseButton}
				setMenuCollapsed={setMenuCollapsed}
				setShowHeaderButtons={setShowHeaderButtons}
				setImmersiveMode={setImmersiveMode}
				setShowContentBackground={setShowContentBackground}
				setEnableCompactMode={setEnableCompactMode}
				setSidebarToolbar={setSidebarToolbar}
				setShowTabs={setShowTabs}
				setEnablePageCache={setEnablePageCache}
				setTabsStyle={setTabsStyle}
				setPageTransitionType={setPageTransitionType}
			/>
		</div>
	);
}

// ==================== 抽屉容器组件 ====================

interface SystemSettingsDrawerProps {
	open: boolean;
	onClose: () => void;
}

function SystemSettingsDrawer({ open, onClose }: SystemSettingsDrawerProps) {
	const { locale, isFloatingUI, borderRadius, resetToDefaults, sidebarToolbar, menuLayout } = useSystemStore();
	const commonLocale = getCommonLocale(locale);

	// 当侧边栏工具栏启用且是垂直布局时，抽屉从左侧弹出
	const placement = sidebarToolbar && menuLayout === 'vertical' ? 'left' : 'right';

	// 处理重置
	const handleReset = () => {
		// 清除 localStorage 中的菜单折叠状态，重置为展开
		localStorage.removeItem('ant_admin_menu_collapsed');
		// 重置其他设置
		resetToDefaults();
		// 刷新页面使所有状态重新初始化
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};

	// 根据弹出方向计算样式
	const getWrapperStyle = () => {
		if (!isFloatingUI) return {};

		const baseStyle = {
			top: '12px',
			bottom: '12px',
			height: 'calc(100vh - 24px)',
			borderRadius: `${borderRadius}px`,
			overflow: 'hidden',
			boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
		};

		if (placement === 'left') {
			return { ...baseStyle, left: '12px' };
		}
		return { ...baseStyle, right: '12px' };
	};

	return (
		<Drawer
			title={
				<div className="flex items-center justify-between pr-2">
					<span>{commonLocale.drawer.systemSettings}</span>
					<Popconfirm
						title={commonLocale.dialogs.confirmReset}
						description={commonLocale.dialogs.confirmResetDescription}
						onConfirm={handleReset}
						okText={commonLocale.buttons.confirm}
						cancelText={commonLocale.buttons.cancel}
						placement={placement === 'left' ? 'bottomLeft' : 'bottomRight'}
					>
						<Button
							type="text"
							icon={<i className="ri-restart-line" style={{ fontSize: '16px' }} />}
							size="small"
							style={{
								width: '32px',
								height: '32px',
								minWidth: '32px',
								minHeight: '32px',
								padding: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: `${borderRadius}px`,
							}}
							title={commonLocale.buttons.reset}
						/>
					</Popconfirm>
				</div>
			}
			placement={placement}
			size={300}
			open={open}
			onClose={onClose}
			maskClosable={true}
			getContainer={document.body}
			styles={{
				wrapper: getWrapperStyle(),
				header: {
					padding: '12px 16px',
					fontSize: '13px',
					minHeight: 'auto',
					borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
				},
				body: {
					padding: '8px 12px',
					borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
				},
				mask: {
					backgroundColor: 'transparent',
					backdropFilter: 'none',
				},
			}}
		>
			<SettingsContent />
		</Drawer>
	);
}

// ==================== Hook ====================

/**
 * 带有状态管理的系统设置抽屉 Hook
 */
export function useSystemSettingsDrawer() {
	const [open, setOpen] = useState(false);

	const showDrawer = () => setOpen(true);
	const hideDrawer = () => setOpen(false);

	return {
		open,
		showDrawer,
		hideDrawer,
	};
}

export default SystemSettingsDrawer;
