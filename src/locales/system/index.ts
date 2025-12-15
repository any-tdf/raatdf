/**
 * 系统级多语言配置 - 单一信息源
 *
 * 后续维护者如需添加新语言，只需：
 * 1. 在 src/locales/system 目录下创建新的语言配置文件（如 ja_JP.ts）
 * 2. 在该文件中添加语言的 meta 信息和翻译内容
 *    - 必须包含：datePickerLocale, proComponentsIntl 字段
 * 3. 在下方的 LOCALE_MODULES 数组中导入该文件
 * 4. 在 src/locales/system/types.ts 的 Locale 类型中添加新语言代码
 *
 * 注意：菜单项由后端接口提供，无需在此配置
 */

import enUSConfig from './en_US';
import type { CommonUI, ConfigItems, Locale, LocaleOption, LocalizationConfig } from './types';
import zhCNConfig from './zh_CN';

// ============================================================================
// 导出类型
// ============================================================================

export type { CommonUI, ConfigItems, Locale, LocaleOption, LocalizationConfig };

// ============================================================================
// 语言模块列表 - 添加新语言的唯一入口
// ============================================================================

/**
 * 所有语言配置模块
 * 添加新语言时，只需在此数组中导入对应的语言文件即可
 *
 * 示例：
 * ```ts
 * import jaJP from 'antd/locale/ja_JP';
 * import jaJPConfig from './ja_JP';
 *
 * const LOCALE_MODULES = [zhCNConfig, enUSConfig, jaJPConfig];
 * ```
 */
const LOCALE_MODULES: LocalizationConfig[] = [zhCNConfig, enUSConfig];

// ============================================================================
// 自动生成配置（无需手动维护）
// ============================================================================

/**
 * 系统支持的语言列表（自动从语言模块的 meta 字段提取）
 */
export const SUPPORTED_LOCALES: LocaleOption[] = LOCALE_MODULES.map((module) => module.meta);

/**
 * 语言配置映射（自动从语言模块生成）
 */
const localeConfigs: Record<Locale, LocalizationConfig> = LOCALE_MODULES.reduce(
	(acc, module) => {
		acc[module.meta.value] = module;
		return acc;
	},
	{} as Record<Locale, LocalizationConfig>
);

/**
 * 默认语言（使用第一个语言作为默认值）
 */
export const DEFAULT_LOCALE: Locale = LOCALE_MODULES[0].meta.value;

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 根据语言代码获取语言配置
 */
export const getLocaleOption = (locale: Locale): LocaleOption => {
	return SUPPORTED_LOCALES.find((l) => l.value === locale) || SUPPORTED_LOCALES[0];
};

/**
 * 获取指定语言的本地化配置
 */
export const getLocale = (locale: Locale): LocalizationConfig => {
	return localeConfigs[locale] || LOCALE_MODULES[0];
};

/**
 * 获取指定语言的通用 UI 文本
 */
export const getCommonLocale = (locale: Locale) => {
	return getLocale(locale).common;
};

/**
 * 获取指定语言的配置项
 */
export const getConfigLocale = (locale: Locale) => {
	return getLocale(locale).config;
};

/**
 * 获取指定语言的 Ant Design 语言包
 */
export const getAntdLocale = (locale: Locale) => {
	const localeOption = getLocaleOption(locale);
	return localeOption.antdLocaleModule;
};

/**
 * 获取指定语言的 dayjs 语言包标识
 */
export const getDayjsLocale = (locale: Locale): string => {
	const localeOption = getLocaleOption(locale);
	return localeOption.dayjsLocale;
};

/**
 * 获取指定语言的 DatePicker 语言包
 */
export const getDatePickerLocale = (locale: Locale) => {
	const localeOption = getLocaleOption(locale);
	return localeOption.datePickerLocale;
};

/**
 * 获取指定语言的 Pro Components 国际化实例
 */
export const getProComponentsIntl = (locale: Locale) => {
	const localeOption = getLocaleOption(locale);
	return localeOption.proComponentsIntl;
};

export default localeConfigs;
