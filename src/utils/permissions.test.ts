import { beforeEach, describe, expect, it } from 'vite-plus/test';

import { getMenuData } from '@/api/mocks/menu';
import { useMenuStore, useUserStore } from '@/store';
import { canAccessPage } from '@/utils/permissions';

describe('page permissions', () => {
	beforeEach(() => {
		useMenuStore.setState(useMenuStore.getInitialState(), true);
		useUserStore.setState(useUserStore.getInitialState(), true);
		useUserStore.getState().setUserInfo({ username: 'user', role: 'user', permissions: ['read'] });
		useMenuStore.getState().setMenuData(getMenuData('zh-CN', 'user'));
	});

	it('allows routes returned by the current user menu', () => {
		expect(canAccessPage('/dashboard')).toBe(true);
	});

	it('rejects a known route that is missing from the current user menu', () => {
		expect(canAccessPage('/examples/query-table')).toBe(false);
	});

	it('lets the router render a 404 for unknown paths', () => {
		expect(canAccessPage('/missing-page')).toBe(true);
	});
});
