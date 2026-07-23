import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vite-plus/test';

import SessionEvents from '@/components/system/session-events';
import { useMenuStore, useSystemStore, useUserStore } from '@/store';
import { dispatchUnauthorized, getAuthToken, saveAuthSession } from '@/utils/auth-session';

const LocationProbe = () => {
	const location = useLocation();
	return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
};

describe('unauthorized session boundary', () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.sessionStorage.clear();
		useMenuStore.setState(useMenuStore.getInitialState(), true);
		useSystemStore.setState(useSystemStore.getInitialState(), true);
		useUserStore.setState(useUserStore.getInitialState(), true);
	});

	it('clears protected state and redirects when the HTTP layer emits a 401 event', async () => {
		saveAuthSession('user_1', 'user', false);
		useUserStore.getState().setUserInfo({ username: 'user', role: 'user', permissions: ['read'] });
		useUserStore.getState().setAuthStatus('authenticated');
		useMenuStore
			.getState()
			.setMenuData([{ key: 'dashboard', label: '仪表盘', path: '/dashboard', component: 'Dashboard' }]);
		useSystemStore.getState().addTab({ key: '/dashboard', label: '仪表盘' });

		render(
			<MemoryRouter initialEntries={['/dashboard']}>
				<SessionEvents />
				<LocationProbe />
			</MemoryRouter>
		);

		act(() => dispatchUnauthorized());

		await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login?reason=expired'));
		expect(getAuthToken()).toBeNull();
		expect(useUserStore.getState().authStatus).toBe('anonymous');
		expect(useMenuStore.getState().menuData).toEqual([]);
		expect(useSystemStore.getState().tabs).toEqual([]);
	});
});
