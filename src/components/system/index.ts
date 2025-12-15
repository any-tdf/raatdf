/**
 * 系统级别组件导出
 *
 * 这个目录包含项目的系统级别组件，是框架的核心组成部分。
 * 业务组件应该放在 src/components 目录下，与这些系统组件区分开。
 */

export { default as CachedOutlet } from '@/components/system/cached-outlet';
export { Logo } from '@/components/system/logo';
export { default as ProtectedRoute } from '@/components/system/protected-route';
export { default as SystemSettingsDrawer, useSystemSettingsDrawer } from '@/components/system/system-settings';
export { default as TabContextMenu } from '@/components/system/tab-context-menu';
export { default as TabsBar } from '@/components/system/tabs-bar';
export { default as ThemeProvider } from '@/components/system/theme-provider';
export { default as ThemeToggle } from '@/components/system/theme-toggle';
