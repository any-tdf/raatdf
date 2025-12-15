// 权限管理工具函数

import { useUserStore } from '@/store';

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

// 检查页面访问权限（由后端菜单接口控制，前端默认允许访问）
export const canAccessPage = (_pathname: string): boolean => {
	// 页面权限由后端菜单接口控制
	// 用户只能看到有权限的菜单项，无权限页面不会出现在菜单中
	return true;
};
