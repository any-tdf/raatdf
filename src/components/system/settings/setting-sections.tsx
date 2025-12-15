/**
 * 设置面板各部分的子组件
 */
import type { ColorPickerProps } from 'antd';
import { Button, ColorPicker, Divider, Select, Slider, Switch, Tooltip, Typography } from 'antd';
import { FEATURE_FLAGS } from '@/config/system';
import { SUPPORTED_LOCALES } from '@/locales';
import type { BorderRadius, ContentWidth, MenuLayout, PageTransitionType, TabsStyle, ThemeMode } from '@/store';
import { useMenuStore } from '@/store/menu-store';
import type { Locale } from '@/store/types';

const { Text } = Typography;

// ==================== 通用组件 ====================

interface SettingRowProps {
	icon: string;
	label: string;
	tooltip?: string;
	children: React.ReactNode;
}

/** 设置项行组件 */
export function SettingRow({ icon, label, tooltip, children }: SettingRowProps) {
	return (
		<div className="flex items-center justify-between py-1">
			<div className="flex items-center gap-1.5">
				<i className={`${icon} text-sm`} />
				<Text style={{ fontSize: '12px' }}>{label}</Text>
				{tooltip && (
					<Tooltip title={tooltip}>
						<i className="ri-information-line text-xs" style={{ cursor: 'help', opacity: 0.6 }} />
					</Tooltip>
				)}
			</div>
			{children}
		</div>
	);
}

interface IconButtonProps {
	icon: string;
	label: string;
	isActive: boolean;
	borderRadius: number;
	onClick: () => void;
}

/** 图标按钮组件（带 hover 提示） */
export function IconButton({ icon, label, isActive, borderRadius, onClick }: IconButtonProps) {
	return (
		<button
			type="button"
			className={`group relative flex cursor-pointer items-center justify-center border-0 px-1 py-2 transition-colors ${
				isActive ? 'bg-(--ant-color-primary-bg)' : 'bg-transparent hover:bg-(--ant-color-fill-secondary)'
			}`}
			style={{ borderRadius: `${borderRadius}px` }}
			onClick={onClick}
		>
			<i className={`${icon} text-xl ${isActive ? 'text-(--ant-color-primary)' : ''}`} />
			<div className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				{label}
			</div>
		</button>
	);
}

// ==================== 主题模式设置 ====================

interface ThemeModeSettingProps {
	themeMode: ThemeMode;
	borderRadius: number;
	locale: { title: string; system: string; light: string; dark: string };
	setThemeMode: (mode: ThemeMode) => void;
}

export function ThemeModeSetting({ themeMode, borderRadius, locale, setThemeMode }: ThemeModeSettingProps) {
	if (!FEATURE_FLAGS.themeMode) return null;

	const modes = [
		{ value: 'system' as const, label: locale.system, icon: 'ri-computer-line' },
		{ value: 'light' as const, label: locale.light, icon: 'ri-sun-line' },
		{ value: 'dark' as const, label: locale.dark, icon: 'ri-moon-line' },
	];

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="grid grid-cols-3 gap-1">
					{modes.map((mode) => (
						<IconButton
							key={mode.value}
							icon={mode.icon}
							label={mode.label}
							isActive={themeMode === mode.value}
							borderRadius={borderRadius}
							onClick={() => setThemeMode(mode.value)}
						/>
					))}
				</div>
			</div>
		</>
	);
}

// ==================== 主题色设置 ====================

interface PrimaryColorSettingProps {
	primaryColor: string;
	borderRadius: number;
	locale: { title: string; customize: string };
	presetColors: Array<{ value: string; label: string }>;
	setPrimaryColor: (color: string) => void;
}

export function PrimaryColorSetting({
	primaryColor,
	borderRadius,
	locale,
	presetColors,
	setPrimaryColor,
}: PrimaryColorSettingProps) {
	if (!FEATURE_FLAGS.primaryColor) return null;

	const handleColorChange: ColorPickerProps['onChange'] = (color) => {
		if (color?.toHexString) {
			setPrimaryColor(color.toHexString());
		}
	};

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<div
								className="h-4 w-4 rounded border border-(--ant-color-border)"
								style={{ backgroundColor: primaryColor }}
							/>
							<Text code style={{ fontSize: '11px' }}>
								{primaryColor}
							</Text>
						</div>
						<ColorPicker
							value={primaryColor}
							onChange={handleColorChange}
							showText={false}
							size="small"
							placement="bottomRight"
						>
							<Button
								type="text"
								size="small"
								style={{ color: 'var(--ant-color-text-tertiary)', fontSize: '11px', padding: '0 4px' }}
							>
								{locale.customize}
							</Button>
						</ColorPicker>
					</div>

					<div className="flex items-center justify-between">
						{presetColors.map((color) => (
							<button
								type="button"
								key={color.value}
								className="group relative flex h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 shrink-0 cursor-pointer items-center justify-center border-0 p-0 transition-all duration-200"
								style={{
									backgroundColor: color.value,
									opacity: primaryColor === color.value ? 1 : 0.7,
									borderRadius: `${borderRadius}px`,
								}}
								onClick={() => setPrimaryColor(color.value)}
								onMouseEnter={(e) => {
									if (primaryColor !== color.value) e.currentTarget.style.opacity = '1';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.opacity = primaryColor === color.value ? '1' : '0.7';
								}}
								title={color.label}
							>
								{primaryColor === color.value && (
									<i className="ri-check-line -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 font-black text-[10px] text-white" />
								)}
								<div className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
									{color.label}
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

// ==================== 菜单布局设置 ====================

interface MenuLayoutSettingProps {
	menuLayout: MenuLayout;
	borderRadius: number;
	locale: { title: string; vertical: string; horizontal: string; mixed: string };
	setMenuLayout: (layout: MenuLayout) => void;
}

export function MenuLayoutSetting({ menuLayout, borderRadius, locale, setMenuLayout }: MenuLayoutSettingProps) {
	if (!FEATURE_FLAGS.menuLayout) return null;

	const layouts = [
		{ value: 'vertical' as const, label: locale.vertical, icon: 'ri-layout-left-line' },
		{ value: 'horizontal' as const, label: locale.horizontal, icon: 'ri-layout-top-line' },
		{ value: 'mixed' as const, label: locale.mixed, icon: 'ri-layout-grid-line' },
	];

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="grid grid-cols-3 gap-1">
					{layouts.map((layout) => (
						<IconButton
							key={layout.value}
							icon={layout.icon}
							label={layout.label}
							isActive={menuLayout === layout.value}
							borderRadius={borderRadius}
							onClick={() => setMenuLayout(layout.value)}
						/>
					))}
				</div>
			</div>
		</>
	);
}

// ==================== 内容宽度设置 ====================

interface ContentWidthSettingProps {
	contentWidth: ContentWidth;
	fixedWidthMax: number;
	maxWidthValue: number;
	borderRadius: number;
	locale: { title: string; full: string; fixed: string };
	setContentWidth: (width: ContentWidth) => void;
	setFixedWidthMax: (value: number) => void;
}

export function ContentWidthSetting({
	contentWidth,
	fixedWidthMax,
	maxWidthValue,
	borderRadius,
	locale,
	setContentWidth,
	setFixedWidthMax,
}: ContentWidthSettingProps) {
	if (!FEATURE_FLAGS.contentWidth) return null;

	const widths = [
		{ value: 'full' as const, label: locale.full, icon: 'ri-expand-horizontal-fill' },
		{ value: 'fixed' as const, label: locale.fixed, icon: 'ri-expand-width-fill' },
	];

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="grid grid-cols-2 gap-1">
					{widths.map((width) => (
						<IconButton
							key={width.value}
							icon={width.icon}
							label={width.label}
							isActive={contentWidth === width.value}
							borderRadius={borderRadius}
							onClick={() => setContentWidth(width.value)}
						/>
					))}
				</div>
			</div>

			{contentWidth === 'fixed' && (
				<div className="mb-1">
					<Slider
						min={600}
						max={maxWidthValue}
						step={10}
						value={Math.min(fixedWidthMax, maxWidthValue)}
						onChange={(value) => setFixedWidthMax(value as number)}
						className="m-0"
					/>
				</div>
			)}
		</>
	);
}

// ==================== 语言设置 ====================

interface LanguageSettingProps {
	locale: Locale;
	borderRadius: number;
	title: string;
}

export function LanguageSetting({ locale, borderRadius, title }: LanguageSettingProps) {
	const { loadMenuData } = useMenuStore();

	if (!FEATURE_FLAGS.language) return null;

	const handleLanguageChange = (newLocale: Locale) => {
		const storageKey = 'app-system-preferences';
		const currentState = localStorage.getItem(storageKey);
		if (currentState) {
			const parsedState = JSON.parse(currentState);
			parsedState.state.locale = newLocale;
			localStorage.setItem(storageKey, JSON.stringify(parsedState));
		}
		loadMenuData(newLocale);
		window.location.reload();
	};

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="grid grid-cols-2 gap-1">
					{SUPPORTED_LOCALES.map((option) => (
						<button
							type="button"
							key={option.value}
							className={`group relative flex cursor-pointer flex-col items-center gap-0.5 border-0 px-1 py-1.5 transition-colors ${
								locale === option.value
									? 'bg-(--ant-color-primary-bg)'
									: 'bg-transparent hover:bg-(--ant-color-fill-secondary)'
							}`}
							style={{ borderRadius: `${borderRadius}px` }}
							onClick={() => handleLanguageChange(option.value as Locale)}
						>
							<span className={`text-xl ${locale === option.value ? '' : 'grayscale-30'}`}>{option.flag}</span>
							<div className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
								{option.label}
							</div>
						</button>
					))}
				</div>
			</div>
		</>
	);
}

// ==================== 圆角设置 ====================

interface BorderRadiusSettingProps {
	borderRadius: BorderRadius;
	locale: { title: string };
	marks: Array<{ value: string; label: string }>;
	setBorderRadius: (radius: BorderRadius) => void;
}

export function BorderRadiusSetting({ borderRadius, locale, marks, setBorderRadius }: BorderRadiusSettingProps) {
	if (!FEATURE_FLAGS.borderRadius) return null;

	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<Slider
					min={0}
					max={24}
					step={null}
					value={borderRadius}
					onChange={(value) => setBorderRadius(value as BorderRadius)}
					className="m-0"
					marks={Object.fromEntries(marks.map((item) => [item.value, item.label]))}
					tooltip={{ open: false }}
				/>
			</div>
		</>
	);
}

// ==================== 显示设置 ====================

interface DisplaySettingsProps {
	isFullscreen: boolean;
	isFloatingUI: boolean;
	showRefreshButton: boolean;
	showCollapseButton: boolean;
	menuCollapsed: boolean;
	showHeaderButtons: boolean;
	isImmersiveMode: boolean;
	showContentBackground: boolean;
	enableCompactMode: boolean;
	sidebarToolbar: boolean;
	showTabs: boolean;
	enablePageCache: boolean;
	tabsStyle: TabsStyle;
	pageTransitionType: PageTransitionType;
	menuLayout: MenuLayout;
	locale: {
		title: string;
		fullscreen: string;
		floatingUI: string;
		refreshButton: string;
		collapseButton: string;
		expandMenu: string;
		headerButtons: string;
		headerButtonsTooltip: string;
		immersiveMode: string;
		immersiveModeLimit: string;
		cardContainer: string;
		compactMode: string;
		sidebarToolbar: string;
		sidebarToolbarTooltip: string;
		multiTabs: string;
		multiTabsLimit: string;
		pageCache: string;
		pageCacheLimit: string;
	};
	tabsStyleLocale: { title: string };
	pageTransitionLocale: { title: string };
	tabsStyleOptions: Array<{ value: string; label: string }>;
	transitionOptions: Array<{ value: string; label: string }>;
	toggleFullscreen: () => void;
	setFloatingUI: (value: boolean) => void;
	setShowRefreshButton: (value: boolean) => void;
	setShowCollapseButton: (value: boolean) => void;
	setMenuCollapsed: (value: boolean) => void;
	setShowHeaderButtons: (value: boolean) => void;
	setImmersiveMode: (value: boolean) => void;
	setShowContentBackground: (value: boolean) => void;
	setEnableCompactMode: (value: boolean) => void;
	setSidebarToolbar: (value: boolean) => void;
	setShowTabs: (value: boolean) => void;
	setEnablePageCache: (value: boolean) => void;
	setTabsStyle: (style: TabsStyle) => void;
	setPageTransitionType: (type: PageTransitionType) => void;
}

export function DisplaySettings({
	isFullscreen,
	isFloatingUI,
	showRefreshButton,
	showCollapseButton,
	menuCollapsed,
	showHeaderButtons,
	isImmersiveMode,
	showContentBackground,
	enableCompactMode,
	sidebarToolbar,
	showTabs,
	enablePageCache,
	tabsStyle,
	pageTransitionType,
	menuLayout,
	locale,
	tabsStyleLocale,
	pageTransitionLocale,
	tabsStyleOptions,
	transitionOptions,
	toggleFullscreen,
	setFloatingUI,
	setShowRefreshButton,
	setShowCollapseButton,
	setMenuCollapsed,
	setShowHeaderButtons,
	setImmersiveMode,
	setShowContentBackground,
	setEnableCompactMode,
	setSidebarToolbar,
	setShowTabs,
	setEnablePageCache,
	setTabsStyle,
	setPageTransitionType,
}: DisplaySettingsProps) {
	return (
		<>
			<Divider style={{ margin: '8px 0' }}>
				<Text strong style={{ fontSize: '12px' }}>
					{locale.title}
				</Text>
			</Divider>
			<div className="mb-1">
				<div className="space-y-1">
					{FEATURE_FLAGS.fullscreen && (
						<SettingRow icon="ri-fullscreen-line" label={locale.fullscreen}>
							<Switch checked={isFullscreen} onChange={toggleFullscreen} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.floatingUI && (
						<SettingRow icon="ri-layout-masonry-line" label={locale.floatingUI}>
							<Switch checked={isFloatingUI} onChange={setFloatingUI} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.refreshButton && (
						<SettingRow icon="ri-refresh-line" label={locale.refreshButton}>
							<Switch checked={showRefreshButton} onChange={setShowRefreshButton} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.collapseButton && (
						<SettingRow icon="ri-menu-fold-line" label={locale.collapseButton}>
							<Switch checked={showCollapseButton} onChange={setShowCollapseButton} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.collapseButton && !showCollapseButton && (
						<SettingRow icon="ri-sidebar-unfold-line" label={locale.expandMenu}>
							<Switch checked={!menuCollapsed} onChange={(checked) => setMenuCollapsed(!checked)} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.headerButtons && (
						<SettingRow icon="ri-puzzle-2-line" label={locale.headerButtons} tooltip={locale.headerButtonsTooltip}>
							<Switch checked={showHeaderButtons} onChange={setShowHeaderButtons} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.immersiveMode && (
						<SettingRow icon="ri-focus-3-line" label={locale.immersiveMode} tooltip={locale.immersiveModeLimit}>
							<Switch checked={isImmersiveMode} onChange={setImmersiveMode} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.cardContainer && (
						<SettingRow icon="ri-artboard-line" label={locale.cardContainer}>
							<Switch checked={showContentBackground} onChange={setShowContentBackground} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.compactMode && (
						<SettingRow icon="ri-fullscreen-exit-line" label={locale.compactMode}>
							<Switch checked={enableCompactMode} onChange={setEnableCompactMode} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.sidebarToolbar && (
						<SettingRow
							icon="ri-layout-bottom-line"
							label={locale.sidebarToolbar}
							tooltip={locale.sidebarToolbarTooltip}
						>
							<Switch
								checked={sidebarToolbar}
								onChange={setSidebarToolbar}
								size="small"
								disabled={menuLayout !== 'vertical'}
							/>
						</SettingRow>
					)}
					{FEATURE_FLAGS.tabs && (
						<SettingRow icon="ri-window-line" label={locale.multiTabs} tooltip={locale.multiTabsLimit}>
							<Switch checked={showTabs} onChange={setShowTabs} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.pageCache && showTabs && (
						<SettingRow icon="ri-save-line" label={locale.pageCache} tooltip={locale.pageCacheLimit}>
							<Switch checked={enablePageCache} onChange={setEnablePageCache} size="small" />
						</SettingRow>
					)}
					{FEATURE_FLAGS.tabsStyle && showTabs && (
						<SettingRow icon="ri-stack-line" label={tabsStyleLocale.title}>
							<Select
								value={tabsStyle}
								onChange={(value) => setTabsStyle(value as TabsStyle)}
								size="small"
								style={{ width: '130px', fontSize: '11px' }}
								popupMatchSelectWidth={false}
								options={tabsStyleOptions.map((option) => ({ value: option.value, label: option.label }))}
							/>
						</SettingRow>
					)}
					{FEATURE_FLAGS.pageTransition && (
						<SettingRow icon="ri-page-separator" label={pageTransitionLocale.title}>
							<Select
								value={pageTransitionType}
								onChange={(value) => setPageTransitionType(value as PageTransitionType)}
								size="small"
								style={{ width: '130px', fontSize: '11px' }}
								popupMatchSelectWidth={false}
								options={transitionOptions.map((option) => ({ value: option.value, label: option.label }))}
							/>
						</SettingRow>
					)}
				</div>
			</div>
		</>
	);
}
