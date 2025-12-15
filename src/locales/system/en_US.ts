import { enUSIntl } from '@ant-design/pro-components';
import datePickerEnUS from 'antd/es/date-picker/locale/en_US';
import enUS from 'antd/locale/en_US';
import type { LocalizationConfig } from './types';

/**
 * 英语翻译配置
 */
const enUSConfig: LocalizationConfig = {
	meta: {
		value: 'en-US',
		label: 'English',
		flag: '🇺🇸',
		antdLocale: 'en_US',
		antdLocaleModule: enUS,
		dayjsLocale: 'en',
		datePickerLocale: datePickerEnUS,
		proComponentsIntl: enUSIntl,
	},
	common: {
		system: {
			name: 'RAATDF',
			tagline: 'Efficient, elegant and lightweight admin system',
			copyright: 'Built with any-tdf',
		},
		api: {
			badRequest: 'Invalid request parameters',
			unauthorized: 'Unauthorized, please login again',
			forbidden: 'Access denied',
			notFound: 'Resource not found',
			timeout: 'Request timeout',
			conflict: 'Request conflict',
			validationError: 'Validation failed',
			serverError: 'Internal server error',
			gatewayError: 'Gateway error',
			serviceUnavailable: 'Service temporarily unavailable',
			networkError: 'Network connection failed, please check your network settings',
			connectionError: 'Network connection error',
			unknownError: 'Network request failed, please try again later',
		},
		theme: {
			title: 'Theme',
			system: 'System',
			light: 'Light',
			dark: 'Dark',
		},
		themeColor: {
			title: 'Theme Color',
			customize: 'Customize',
			defaultBlue: 'Default Blue',
			greenShade: 'Green Shade',
			warmOrange: 'Warm Orange',
			elegantPurple: 'Elegant Purple',
			charmRed: 'Charm Red',
			calmTeal: 'Calm Teal',
			verdigris: 'Verdigris',
			amber: 'Amber',
			roseGold: 'Rose Gold',
			indigo: 'Indigo',
		},
		layout: {
			title: 'Layout',
			vertical: 'Sidebar',
			horizontal: 'Top Bar',
			mixed: 'Mixed',
			doubleColumn: 'Double Column',
		},
		pageWidth: {
			title: 'Page Width',
			full: 'Auto-fit',
			fixed: 'Fixed Width',
		},
		display: {
			title: 'Display',
			fullscreen: 'Fullscreen',
			floatingUI: 'Floating UI',
			refreshButton: 'Refresh Button',
			collapseButton: 'Collapse Button',
			headerButtons: 'Header Buttons',
			headerButtonsTooltip: 'Whether to show functions in the left area of the header settings button',
			immersiveMode: 'Immersive Mode',
			immersiveModeLimit: 'Hide all non-page content, exit from top-right',
			cardContainer: 'Card Container',
			expandMenu: 'Expand Menu',
			multiTabs: 'Multi-tab',
			multiTabsLimit: 'Maximum 16 tabs, oldest will be auto-closed when exceeded',
			pageCache: 'Page Cache',
			pageCacheLimit: 'Caching page data may affect performance',
			language: 'Language',
			compactMode: 'Compact Mode',
			sidebarToolbar: 'Sidebar Toolbar',
			sidebarToolbarTooltip: 'Place avatar, settings buttons at sidebar bottom, only works in sidebar layout',
		},
		borderRadius: {
			title: 'Radius',
		},
		tabsStyle: {
			title: 'Tab Style',
			default: 'Default',
			button: 'Button',
			simple: 'Simple',
			card: 'Stacked',
		},
		pageTransition: {
			title: 'Page Transition',
			slideLeft: 'Slide Left',
			fade: 'Fade',
			slideUp: 'Slide Up',
			slideDown: 'Slide Down',
			scale: 'Scale',
			none: 'None',
		},
		buttons: {
			reset: 'Reset to Default',
			confirm: 'Confirm',
			cancel: 'Cancel',
			close: 'Close',
		},
		dialogs: {
			confirmReset: 'Confirm Reset',
			confirmResetDescription: 'Are you sure you want to reset all settings to default values?',
		},
		drawer: {
			systemSettings: 'System Settings',
		},
		accountMenu: {
			logout: 'Logout',
			logoutConfirmTitle: 'Logout',
			logoutConfirmContent: 'Are you sure you want to logout?',
			logoutSuccess: 'Successfully logged out',
			logoutFailed: 'Logout failed, please try again',
		},
		permission: {
			noAccess: 'You do not have permission to access this page',
		},
		tabContextMenu: {
			pin: 'Pin',
			unpin: 'Unpin',
			closeLeft: 'Close Left',
			closeRight: 'Close Right',
			closeOthers: 'Close Others',
		},
		loading: {
			checkingAuth: 'Checking login status...',
		},
	},
	config: {
		theme: {
			modes: [
				{ label: 'System', description: 'Follow system preferences' },
				{ label: 'Light', description: 'Always use light theme' },
				{ label: 'Dark', description: 'Always use dark theme' },
			],
			presetColors: [
				{ label: 'Default Blue', name: 'defaultBlue' },
				{ label: 'Green Shade', name: 'greenShade' },
				{ label: 'Warm Orange', name: 'warmOrange' },
				{ label: 'Elegant Purple', name: 'elegantPurple' },
				{ label: 'Charm Red', name: 'charmRed' },
				{ label: 'Calm Teal', name: 'calmTeal' },
				{ label: 'Verdigris', name: 'verdigris' },
				{ label: 'Amber', name: 'amber' },
				{ label: 'Rose Gold', name: 'roseGold' },
				{ label: 'Indigo', name: 'indigo' },
			],
		},
		layout: {
			menuLayouts: [
				{ value: 'vertical', label: 'Sidebar' },
				{ value: 'horizontal', label: 'Top Bar' },
				{ value: 'mixed', label: 'Mixed' },
			],
			contentWidths: [
				{ value: 'full', label: 'Auto-fit' },
				{ value: 'fixed', label: 'Fixed Width' },
			],
			borderRadiuses: [
				{ value: '0', label: '0' },
				{ value: '2', label: '2' },
				{ value: '4', label: '4' },
				{ value: '6', label: '6' },
				{ value: '8', label: '8' },
				{ value: '12', label: '12' },
				{ value: '16', label: '16' },
				{ value: '20', label: '20' },
				{ value: '24', label: '24' },
			],
		},
		tabs: {
			options: [
				{ value: 'default', label: 'Default' },
				{ value: 'button', label: 'Button' },
				{ value: 'simple', label: 'Simple' },
				{ value: 'card', label: 'Stacked' },
			],
		},
		pageTransition: {
			options: [
				{ value: 'slideLeft', label: 'Slide Left' },
				{ value: 'fade', label: 'Fade' },
				{ value: 'slideUp', label: 'Slide Up' },
				{ value: 'slideDown', label: 'Slide Down' },
				{ value: 'scale', label: 'Scale' },
				{ value: 'none', label: 'None' },
			],
		},
	},
};

export default enUSConfig;
