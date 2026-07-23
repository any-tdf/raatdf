/**
 * 用户模块 API
 */

import { getMenuData, type MenuItem, type UserRole } from '@/api/mocks/menu';
import type { Locale } from '@/locales';
import httpClient, { type ApiResponse } from '@/utils/http';

import type { LoginRequest, LoginResponse, UserInfo } from './types';

export type ApiMode = 'mock' | 'remote';

const getApiMode = (): ApiMode => import.meta.env.VITE_API_MODE ?? (import.meta.env.DEV ? 'mock' : 'remote');

const assertRemoteConfiguration = (): void => {
	if (getApiMode() === 'mock' && !import.meta.env.DEV) {
		throw new Error('生产环境不允许使用 Mock API，请将 VITE_API_MODE 设置为 remote。');
	}

	if (getApiMode() === 'remote' && !import.meta.env.VITE_API_BASE_URL) {
		throw new Error('缺少 VITE_API_BASE_URL，无法连接生产 API。');
	}
};

const wait = async (duration: number): Promise<void> => {
	await new Promise((resolve) => setTimeout(resolve, duration));
};

const getMockRole = (token: string): UserRole | null => {
	const match = /^(admin|user)_\d+$/.exec(token);
	return match ? (match[1] as UserRole) : null;
};

const getMockProfile = (role: UserRole): UserInfo => ({
	id: role === 'admin' ? '1' : '2',
	username: role,
	email: role === 'admin' ? 'admin@example.com' : 'user@example.com',
	role,
	permissions: role === 'admin' ? ['*'] : ['read'],
});

/**
 * 用户 API 模块。
 * 开发环境默认使用 Mock，生产环境必须显式配置远程 API。
 */
export const userApi = {
	async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		if (getApiMode() === 'remote') {
			assertRemoteConfiguration();
			const response = await httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
			return response.data;
		}

		assertRemoteConfiguration();
		await wait(600);
		const isKnownUser = credentials.username === 'admin' || credentials.username === 'user';
		if (!isKnownUser || credentials.password !== '123456') {
			return {
				code: 401,
				message: '用户名或密码错误',
				success: false,
			};
		}

		return {
			code: 200,
			message: '登录成功',
			data: {
				accessToken: `${credentials.username}_${Date.now()}`,
				expiresIn: 24 * 60 * 60,
			},
			success: true,
		};
	},

	async logout(): Promise<ApiResponse<{ success: boolean }>> {
		if (getApiMode() === 'remote') {
			assertRemoteConfiguration();
			const response = await httpClient.post<ApiResponse<{ success: boolean }>>('/auth/logout');
			return response.data;
		}

		assertRemoteConfiguration();
		await wait(200);
		return {
			code: 200,
			message: '登出成功',
			data: { success: true },
			success: true,
		};
	},

	async getProfile(token: string): Promise<ApiResponse<UserInfo>> {
		if (getApiMode() === 'remote') {
			assertRemoteConfiguration();
			const response = await httpClient.get<ApiResponse<UserInfo>>('/auth/profile', {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		}

		assertRemoteConfiguration();
		const role = getMockRole(token);
		if (!role) {
			return { code: 401, message: '登录状态无效', success: false };
		}

		return {
			code: 200,
			message: '获取成功',
			data: getMockProfile(role),
			success: true,
		};
	},

	async getMenu(token: string, locale: Locale): Promise<ApiResponse<MenuItem[]>> {
		if (getApiMode() === 'remote') {
			assertRemoteConfiguration();
			const response = await httpClient.get<ApiResponse<MenuItem[]>>('/auth/menu', {
				headers: { Authorization: `Bearer ${token}` },
				params: { locale },
			});
			return response.data;
		}

		assertRemoteConfiguration();
		await wait(200);
		const role = getMockRole(token);
		if (!role) {
			return { code: 401, message: '登录状态无效', success: false };
		}

		return {
			code: 200,
			message: '获取成功',
			data: getMenuData(locale, role),
			success: true,
		};
	},
};

export default userApi;
