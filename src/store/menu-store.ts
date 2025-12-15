/**
 * 菜单状态管理 Store
 * 用于管理动态菜单数据，根据语言切换自动更新菜单
 */

import { create } from 'zustand';
import { getMenuData, type MenuItem, type UserRole } from '@/api/mocks/menu';
import type { Locale } from '@/store/types';
import { useUserStore } from './user-store';

/**
 * 从 Zustand 获取当前用户角色
 */
const getCurrentUserRole = (): UserRole => {
	const { userInfo } = useUserStore.getState();
	return userInfo?.role || 'user';
};

/**
 * 从 localStorage 获取保存的语言设置
 */
const getSavedLocale = (): Locale => {
	try {
		const systemPreferences = localStorage.getItem('app-system-preferences');
		if (systemPreferences) {
			const parsed = JSON.parse(systemPreferences);
			return parsed.state?.locale || 'zh-CN';
		}
	} catch {
		// 解析失败时返回默认值
	}
	return 'zh-CN';
};

interface MenuState {
	/** 当前菜单数据 */
	menuData: MenuItem[];
	/** 加载状态 */
	isLoading: boolean;
	/** 设置菜单数据 */
	setMenuData: (menuData: MenuItem[]) => void;
	/** 根据语言加载菜单数据 */
	loadMenuData: (locale: Locale) => Promise<void>;
}

/**
 * 菜单状态管理 Store
 */
export const useMenuStore = create<MenuState>((set) => ({
	// 初始状态 - 使用保存的语言设置加载菜单，避免语言切换时的闪烁
	menuData: getMenuData(getSavedLocale(), getCurrentUserRole()),
	isLoading: false,

	// 设置菜单数据
	setMenuData: (menuData: MenuItem[]) => {
		set({ menuData });
	},

	// 根据语言加载菜单数据
	loadMenuData: async (locale: Locale) => {
		set({ isLoading: true });
		// 模拟 API 请求延迟
		await new Promise((resolve) => setTimeout(resolve, 300));
		// 获取当前用户角色
		const role = getCurrentUserRole();
		const newMenuData = getMenuData(locale, role);
		set({ menuData: newMenuData, isLoading: false });
	},
}));
