import { create } from 'zustand';
import type { UserRole } from '@/api/mocks/menu';

/**
 * 用户信息接口
 */
export interface UserInfo {
	/** 用户 ID */
	id?: string;
	/** 用户名 */
	username: string;
	/** 邮箱 */
	email: string;
	/** 昵称 */
	nickname?: string;
	/** 头像 URL */
	avatar?: string;
	/** 用户角色 */
	role: UserRole;
	/** 权限列表 */
	permissions?: string[];
}

/**
 * 用户状态接口
 */
export interface UserState {
	/** 用户信息 */
	userInfo: UserInfo | null;
	/** 是否已登录 */
	isLoggedIn: boolean;

	/** 设置用户信息 */
	setUserInfo: (userInfo: UserInfo) => void;
	/** 清除用户信息（退出登录） */
	clearUserInfo: () => void;
	/** 更新用户头像 */
	updateAvatar: (avatar: string) => void;
	/** 更新用户昵称 */
	updateNickname: (nickname: string) => void;
}

/**
 * 用户信息状态管理 Store
 * 注意：用户信息仅保存在内存中，不持久化到 localStorage
 * 刷新页面后需要通过 token 重新获取用户信息
 */
export const useUserStore = create<UserState>((set) => ({
	// 初始状态
	userInfo: null,
	isLoggedIn: false,

	// 设置用户信息
	setUserInfo: (userInfo: UserInfo) => {
		set({
			userInfo,
			isLoggedIn: true,
		});
	},

	// 清除用户信息（退出登录）
	clearUserInfo: () => {
		set({
			userInfo: null,
			isLoggedIn: false,
		});
	},

	// 更新用户头像
	updateAvatar: (avatar: string) => {
		set((state) => ({
			userInfo: state.userInfo ? { ...state.userInfo, avatar } : null,
		}));
	},

	// 更新用户昵称
	updateNickname: (nickname: string) => {
		set((state) => ({
			userInfo: state.userInfo ? { ...state.userInfo, nickname } : null,
		}));
	},
}));
