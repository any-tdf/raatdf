import type { MenuItem } from '@/api/mocks/menu';
import { userApi } from '@/api/modules/user';
import type { LoginRequest } from '@/api/modules/user/types';
import { useMenuStore, useSystemStore, useUserStore } from '@/store';
import { clearAuthSession, getAuthToken, saveAuthSession } from '@/utils/auth-session';

const getResponseData = <T>(response: { success: boolean; data?: T; message: string }): T => {
	if (!response.success || !response.data) {
		throw new Error(response.message);
	}

	return response.data;
};

export const getFirstMenuPath = (items: MenuItem[]): string => {
	for (const item of items) {
		if (item.path) {
			return item.path;
		}
		if (item.children?.length) {
			const childPath = getFirstMenuPath(item.children);
			if (childPath) {
				return childPath;
			}
		}
	}

	return '/403';
};

export const clearAuthentication = (): void => {
	clearAuthSession();
	useMenuStore.getState().clearMenuData();
	useSystemStore.getState().clearAllTabsAndCache();
	useUserStore.getState().clearUserInfo();
};

export const initializeAuthentication = async (): Promise<boolean> => {
	const userStore = useUserStore.getState();
	userStore.setAuthStatus('initializing');
	const token = getAuthToken();

	if (!token) {
		clearAuthentication();
		return false;
	}

	try {
		const locale = useSystemStore.getState().locale;
		const [profileResponse, menuResponse] = await Promise.all([
			userApi.getProfile(token),
			userApi.getMenu(token, locale),
		]);
		const user = getResponseData(profileResponse);
		const menuData = getResponseData(menuResponse);

		useMenuStore.getState().setMenuData(menuData);
		useUserStore.getState().setUserInfo({
			id: user.id,
			username: user.username,
			email: user.email,
			nickname: user.nickname,
			avatar: user.avatar,
			role: user.role,
			permissions: user.permissions,
		});
		return true;
	} catch {
		clearAuthentication();
		return false;
	} finally {
		if (useUserStore.getState().authStatus === 'initializing') {
			useUserStore.getState().setAuthStatus('anonymous');
		}
	}
};

export const login = async (credentials: LoginRequest & { rememberMe: boolean }): Promise<string> => {
	try {
		const loginResponse = await userApi.login(credentials);
		const loginData = getResponseData(loginResponse);
		saveAuthSession(loginData.accessToken, credentials.username, credentials.rememberMe);

		const locale = useSystemStore.getState().locale;
		const [profileResponse, menuResponse] = await Promise.all([
			userApi.getProfile(loginData.accessToken),
			userApi.getMenu(loginData.accessToken, locale),
		]);
		const user = getResponseData(profileResponse);
		const menuData = getResponseData(menuResponse);

		useMenuStore.getState().setMenuData(menuData);
		useUserStore.getState().setUserInfo({
			id: user.id,
			username: user.username,
			email: user.email,
			nickname: user.nickname,
			avatar: user.avatar,
			role: user.role,
			permissions: user.permissions,
		});

		return getFirstMenuPath(menuData);
	} catch (error) {
		clearAuthentication();
		throw error;
	}
};

export const logout = async (): Promise<boolean> => {
	const [result] = await Promise.allSettled([userApi.logout()]);
	clearAuthentication();
	return result.status === 'fulfilled' && result.value.success;
};
