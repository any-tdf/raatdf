import { beforeEach, describe, expect, it } from 'vite-plus/test';

import { useSystemStore } from '@/store/system-store';

const addTab = (key: string) => useSystemStore.getState().addTab({ key, label: key, closable: true, pinned: false });

describe('system tab state', () => {
	beforeEach(() => {
		window.localStorage.clear();
		useSystemStore.setState(useSystemStore.getInitialState(), true);
	});

	it('protects pinned tabs from removal', () => {
		addTab('/dashboard');
		useSystemStore.getState().pinTab('/dashboard');

		const result = useSystemStore.getState().removeTab('/dashboard');

		expect(result.activePath).toBe('/dashboard');
		expect(useSystemStore.getState().tabs).toHaveLength(1);
	});

	it('closes other removable tabs, keeps pinned tabs, and selects the context target', () => {
		addTab('/dashboard');
		useSystemStore.getState().pinTab('/dashboard');
		addTab('/profile');
		addTab('/docs');

		const result = useSystemStore.getState().closeOtherTabs('/profile');

		expect(result.activePath).toBe('/profile');
		expect(useSystemStore.getState().tabs.map((tab) => tab.key)).toEqual(['/dashboard', '/profile']);
	});

	it('moves the active route to the context tab when a grouped close removes it', () => {
		addTab('/dashboard');
		addTab('/profile');
		addTab('/docs');

		const result = useSystemStore.getState().closeTabsRight('/dashboard');

		expect(result.activePath).toBe('/dashboard');
		expect(useSystemStore.getState().activeTabKey).toBe('/dashboard');
	});

	it('never evicts a pinned tab when the tab limit is exceeded', () => {
		for (let index = 0; index < 16; index += 1) addTab(`/page-${index}`);
		useSystemStore.getState().pinTab('/page-0');
		addTab('/page-16');

		const paths = useSystemStore.getState().tabs.map((tab) => tab.key);
		expect(paths).toContain('/page-0');
		expect(paths).toContain('/page-16');
		expect(paths).not.toContain('/page-1');
	});

	it('sanitizes invalid persisted values during rehydration', async () => {
		window.localStorage.setItem(
			'app-system-preferences',
			JSON.stringify({ version: 2, state: { themeMode: 'invalid', tabs: [{ key: 1 }] } })
		);

		await useSystemStore.persist.rehydrate();

		expect(useSystemStore.getState().themeMode).toBe('system');
		expect(useSystemStore.getState().tabs).toEqual([]);
	});
});
