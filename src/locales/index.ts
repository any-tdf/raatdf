/**
 * 多语言配置入口
 *
 * 目录结构：
 * - system/  系统级多语言配置（主题、布局、API 错误等）
 * - pages/   页面级多语言配置（每个页面一个文件）
 */

// 导出页面级配置
export {
	getAuthLocale,
	getDashboardLocale,
	getErrorsLocale,
	getProfileLocale,
	getQueryTableLocale,
	getStepFormLocale,
} from './pages';

export type { CommonUI, ConfigItems, Locale, LocaleOption, LocalizationConfig } from './system';
// 导出系统级配置
export {
	DEFAULT_LOCALE,
	getAntdLocale,
	getCommonLocale,
	getConfigLocale,
	getDatePickerLocale,
	getDayjsLocale,
	getLocale,
	getLocaleOption,
	getProComponentsIntl,
	SUPPORTED_LOCALES,
} from './system';
