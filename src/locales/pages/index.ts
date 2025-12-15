/**
 * 页面级多语言配置入口
 *
 * 每个页面对应一个独立的配置文件
 * 有子页面的使用子目录组织
 */

export { getAuthLocale } from './auth';
export { getDashboardLocale } from './dashboard';
export { getErrorsLocale } from './errors';
// 示例页面
export { getQueryTableLocale, getStepFormLocale } from './examples';
export { getProfileLocale } from './profile';
