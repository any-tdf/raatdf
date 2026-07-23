/**
 * 菜单状态管理 Store
 * 用于管理动态菜单数据，根据语言切换自动更新菜单
 */

import { create } from 'zustand';

import type { MenuItem } from '@/api/mocks/menu';
import { userApi } from '@/api/modules/user';
import type { Locale } from '@/store/types';
import { getAuthToken } from '@/utils/auth-session';

interface MenuState {
	/** 当前菜单数据 */
	menuData: MenuItem[];
	/** 加载状态 */
	isLoading: boolean;
	/** 菜单是否已经完成初始化 */
	isReady: boolean;
	/** 设置菜单数据 */
	setMenuData: (menuData: MenuItem[]) => void;
	/** 清空菜单数据 */
	clearMenuData: () => void;
	/** 根据语言加载菜单数据 */
	loadMenuData: (locale: Locale) => Promise<void>;
}

/**
 * 菜单状态管理 Store
 */
export const useMenuStore = create<MenuState>((set) => ({
	menuData: [],
	isLoading: false,
	isReady: false,

	// 设置菜单数据
	setMenuData: (menuData: MenuItem[]) => {
		set({ menuData, isReady: true, isLoading: false });
	},

	clearMenuData: () => {
		set({ menuData: [], isReady: false, isLoading: false });
	},

	// 根据语言加载菜单数据
	loadMenuData: async (locale: Locale) => {
		const token = getAuthToken();
		if (!token) {
			set({ menuData: [], isReady: false, isLoading: false });
			return;
		}

		set({ isLoading: true });
		try {
			const response = await userApi.getMenu(token, locale);
			if (!response.success || !response.data) {
				throw new Error(response.message);
			}
			set({ menuData: response.data, isReady: true });
		} finally {
			set({ isLoading: false });
		}
	},
}));
