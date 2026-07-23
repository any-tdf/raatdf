// 权限管理工具函数

import type { MenuItem } from '@/api/mocks/menu';
import { getAutoRoutes } from '@/router/auto-routes';
import { useMenuStore, useUserStore } from '@/store';

export interface UserPermission {
	id: string;
	name: string;
	permissions: string[];
}

// 获取当前用户权限（实际项目中从后端获取）
export const getCurrentUserPermissions = (): UserPermission => {
	const userInfo = useUserStore.getState().userInfo;
	if (userInfo) {
		return {
			id: userInfo.username,
			name: userInfo.nickname || userInfo.username,
			permissions: userInfo.permissions || [],
		};
	}
	return { id: 'guest', name: '访客', permissions: [] };
};

// 检查用户是否有特定权限
export const hasPermission = (permission: string): boolean => {
	const userPermissions = getCurrentUserPermissions();
	return userPermissions.permissions.includes(permission);
};

// 检查用户是否有任一权限
export const hasAnyPermission = (permissions: string[]): boolean => {
	const userPermissions = getCurrentUserPermissions();
	return permissions.some((permission) => userPermissions.permissions.includes(permission));
};

// 检查用户是否有所有权限
export const hasAllPermissions = (permissions: string[]): boolean => {
	const userPermissions = getCurrentUserPermissions();
	return permissions.every((permission) => userPermissions.permissions.includes(permission));
};

const SYSTEM_PATHS = new Set(['/403', '/404', '/500', '/errors/403', '/errors/404', '/errors/500']);
const KNOWN_PAGE_PATHS = new Set(getAutoRoutes().map((route) => `/${route.path}`));

export const findMenuItemByPath = (items: MenuItem[], pathname: string): MenuItem | null => {
	for (const item of items) {
		if (item.path === pathname) return item;
		if (item.children?.length) {
			const child = findMenuItemByPath(item.children, pathname);
			if (child) return child;
		}
	}

	return null;
};

export const canAccessPage = (pathname: string): boolean => {
	const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
	if (normalizedPath === '/' || SYSTEM_PATHS.has(normalizedPath)) return true;

	const item = findMenuItemByPath(useMenuStore.getState().menuData, normalizedPath);
	if (!item) {
		return !KNOWN_PAGE_PATHS.has(normalizedPath);
	}

	const role = useUserStore.getState().userInfo?.role;
	return !item.roles?.length || (!!role && item.roles.includes(role));
};
