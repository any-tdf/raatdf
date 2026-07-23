import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import { DEFAULT_PRODUCTION_DOCS_URL, LOCAL_DOCS_URL, resolveDocsUrl } from '@/config/docs';
import Docs from '@/pages/docs';
import { useSystemStore } from '@/store';

describe('documentation frame', () => {
	const renderDocs = () => render(<Docs docsUrl="about:blank" />);

	beforeEach(() => {
		useSystemStore.getState().setLocale('zh-CN');
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('always uses the fixed local documentation URL in development', () => {
		expect(resolveDocsUrl({ DEV: true, VITE_DOCS_URL: 'https://preview.example.com' })).toBe(LOCAL_DOCS_URL);
	});

	it('uses the configured production URL with an online default', () => {
		expect(resolveDocsUrl({ DEV: false, VITE_DOCS_URL: 'https://docs.example.com' })).toBe('https://docs.example.com');
		expect(resolveDocsUrl({ DEV: false })).toBe(DEFAULT_PRODUCTION_DOCS_URL);
	});

	it('shows a retry fallback after the load timeout', async () => {
		vi.useFakeTimers();
		renderDocs();

		await act(async () => {
			await vi.advanceTimersByTimeAsync(10_000);
		});

		expect(screen.getByText('文档加载超时')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '重新加载' })).toBeInTheDocument();
	});

	it('removes the loading state after the iframe loads', () => {
		renderDocs();
		const frame = screen.getByTitle('RAATDF 项目文档');
		expect(frame.parentElement).toHaveClass('h-full', 'min-h-0');
		fireEvent.load(frame);

		expect(screen.queryByText('正在加载项目文档')).not.toBeInTheDocument();
	});

	it('updates its controls when the application language changes', () => {
		useSystemStore.getState().setLocale('en-US');
		renderDocs();

		expect(screen.getByRole('link', { name: 'Open in new window' })).toBeInTheDocument();
		expect(screen.getByTitle('RAATDF project documentation')).toBeInTheDocument();
	});
});
