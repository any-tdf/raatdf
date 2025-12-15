/**
 * 用户模块 API
 */

import type { MenuItem } from '@/api/mocks/menu';
import { getMenuData } from '@/api/mocks/menu';
import type { ApiResponse } from '@/utils/http';
import type { LoginRequest, LoginResponse, UserInfo } from './types';

/**
 * 用户 API 模块
 */
export const userApi = {
	/**
	 * 用户登录
	 * @param credentials 用户凭证
	 * @returns 登录响应
	 */
	async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟

		// 根据用户角色生成 token，格式为 role_timestamp
		const timestamp = Date.now();
		const token = `${credentials.username}_${timestamp}`;

		return {
			code: 200,
			message: '登录成功',
			data: {
				accessToken: token,
				expiresIn: 24 * 60 * 60, // 24 小时
			},
			success: true,
		};
	},

	/**
	 * 用户登出
	 * @returns 登出结果
	 */
	async logout(): Promise<ApiResponse<{ success: boolean }>> {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			code: 200,
			message: '登出成功',
			data: { success: true },
			success: true,
		};
	},

	/**
	 * 获取用户个人资料
	 * @returns 用户信息
	 */
	async getProfile(token: string): Promise<ApiResponse<UserInfo>> {
		// 从 token 解析用户角色，格式为 role_timestamp
		const tokenParts = token.split('_');
		const username = tokenParts[0] as 'admin' | 'user';

		const userInfo: UserInfo = {
			id: username === 'admin' ? '1' : '2',
			username,
			email: username === 'admin' ? 'admin@example.com' : 'user@example.com',
			role: username,
			permissions: username === 'admin' ? ['*'] : ['read'],
			avatar: undefined,
		};

		return {
			code: 200,
			message: '获取成功',
			data: userInfo,
			success: true,
		};
	},

	/**
	 * 获取用户菜单
	 * @param token 用户认证 token
	 * @returns 菜单数据
	 */
	async getMenu(token: string): Promise<ApiResponse<MenuItem[]>> {
		await new Promise((resolve) => setTimeout(resolve, 300)); // 模拟网络延迟

		// 从 token 解析用户角色，格式为 role_timestamp
		const tokenParts = token.split('_');

		const userRole = tokenParts[0] as 'admin' | 'user';

		// 获取当前语言设置
		const systemPreferences = localStorage.getItem('app-system-preferences');
		const locale = systemPreferences
			? ((JSON.parse(systemPreferences).state?.locale || 'zh-CN') as 'zh-CN' | 'en-US')
			: 'zh-CN';

		// 根据用户角色返回对应的菜单
		const menuData = getMenuData(locale, userRole);

		return {
			code: 200,
			message: '获取成功',
			data: menuData,
			success: true,
		};
	},
};

export default userApi;
