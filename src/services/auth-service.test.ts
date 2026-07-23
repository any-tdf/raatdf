import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import { userApi } from '@/api/modules/user';
import { clearAuthentication, login } from '@/services/auth-service';
import { useMenuStore, useSystemStore, useUserStore } from '@/store';
import { getAuthToken } from '@/utils/auth-session';

describe('authentication service', () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.sessionStorage.clear();
		useMenuStore.setState(useMenuStore.getInitialState(), true);
		useSystemStore.setState(useSystemStore.getInitialState(), true);
		useUserStore.setState(useUserStore.getInitialState(), true);
	});

	it('commits user and menu state only after the entire login flow succeeds', async () => {
		vi.spyOn(userApi, 'login').mockResolvedValue({
			code: 200,
			message: '成功',
			success: true,
			data: { accessToken: 'admin_1', expiresIn: 3600 },
		});
		vi.spyOn(userApi, 'getProfile').mockResolvedValue({
			code: 200,
			message: '成功',
			success: true,
			data: { id: '1', username: 'admin', role: 'admin', permissions: ['*'] },
		});
		vi.spyOn(userApi, 'getMenu').mockResolvedValue({
			code: 200,
			message: '成功',
			success: true,
			data: [{ key: 'dashboard', label: '仪表盘', path: '/dashboard', component: 'Dashboard' }],
		});

		const firstPath = await login({ username: 'admin', password: '123456', rememberMe: true });

		expect(firstPath).toBe('/dashboard');
		expect(useUserStore.getState().authStatus).toBe('authenticated');
		expect(useMenuStore.getState().isReady).toBe(true);
		expect(getAuthToken()).toBe('admin_1');
	});

	it('rolls back a partial session when profile or menu loading fails', async () => {
		vi.spyOn(userApi, 'login').mockResolvedValue({
			code: 200,
			message: '成功',
			success: true,
			data: { accessToken: 'admin_1', expiresIn: 3600 },
		});
		vi.spyOn(userApi, 'getProfile').mockRejectedValue(new Error('资料加载失败'));
		vi.spyOn(userApi, 'getMenu').mockResolvedValue({ code: 200, message: '成功', success: true, data: [] });

		await expect(login({ username: 'admin', password: '123456', rememberMe: true })).rejects.toThrow('资料加载失败');
		expect(getAuthToken()).toBeNull();
		expect(useUserStore.getState().authStatus).toBe('anonymous');
		expect(useMenuStore.getState().menuData).toEqual([]);
	});

	it('clears every protected runtime state on unauthorized access', () => {
		useSystemStore.getState().addTab({ key: '/dashboard', label: '仪表盘' });
		clearAuthentication();

		expect(useSystemStore.getState().tabs).toEqual([]);
		expect(useUserStore.getState().authStatus).toBe('anonymous');
	});
});
