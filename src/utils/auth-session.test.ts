import { beforeEach, describe, expect, it } from 'vite-plus/test';

import { AUTH_TOKEN_KEY, clearAuthSession, getAuthToken, saveAuthSession } from '@/utils/auth-session';

describe('auth session', () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.sessionStorage.clear();
	});

	it('stores remembered sessions only in local storage', () => {
		saveAuthSession('remembered-token', 'admin', true);

		expect(window.localStorage.getItem(AUTH_TOKEN_KEY)).toBe('remembered-token');
		expect(window.sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
		expect(getAuthToken()).toBe('remembered-token');
	});

	it('stores temporary sessions only in session storage and clears both stores', () => {
		saveAuthSession('temporary-token', 'user', false);

		expect(window.sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe('temporary-token');
		expect(window.localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
		clearAuthSession();
		expect(getAuthToken()).toBeNull();
	});
});
