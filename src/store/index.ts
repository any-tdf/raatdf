/**
 * Store 模块统一导出
 */

// 导出菜单类型
export type { MenuItem } from '@/api/mocks/menu';
// 导出系统设置抽屉 Hook
export { useSystemSettingsDrawer } from '@/components/system';

// 导出菜单状态管理
export * from '@/store/menu-store';
// 导出系统偏好设置状态管理（包含主题管理）
export * from '@/store/system-store';
// 导出类型定义
export * from '@/store/types';
// 导出用户信息状态管理
export * from '@/store/user-store';
