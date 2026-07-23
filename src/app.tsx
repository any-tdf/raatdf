import { Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { system } from '@/components';
import SessionEvents from '@/components/system/session-events';
import AppLayout from '@/layouts/app-layout';
import { getCommonLocale } from '@/locales';
import Auth from '@/pages/auth';
import { getFirstMenuPath, initializeAuthentication } from '@/services/auth-service';
import { useMenuStore, useSystemStore, useUserStore } from '@/store';

const AppRoutes = () => {
	const location = useLocation();
	const authStatus = useUserStore((state) => state.authStatus);
	const { menuData, isReady: isMenuReady } = useMenuStore();
	const locale = useSystemStore((state) => state.locale);
	const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

	if (authStatus === 'initializing' || (authStatus === 'authenticated' && !isMenuReady)) {
		return <Spin size="large" description={getCommonLocale(locale).loading.checkingAuth} fullscreen />;
	}

	if (authStatus !== 'authenticated' && !isPublicRoute) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (authStatus === 'authenticated' && isPublicRoute) {
		return <Navigate to={getFirstMenuPath(menuData)} replace />;
	}

	return (
		<Routes>
			<Route path="/login" element={<Auth />} />
			<Route path="/register" element={<Auth />} />
			<Route
				path="/*"
				element={
					<system.ProtectedRoute>
						<AppLayout />
					</system.ProtectedRoute>
				}
			/>
		</Routes>
	);
};

const App = () => {
	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;
		void initializeAuthentication();
	}, []);

	return (
		<system.ThemeProvider>
			<system.ErrorBoundary>
				<HashRouter>
					<SessionEvents />
					<system.TabContextMenu />
					<AppRoutes />
				</HashRouter>
			</system.ErrorBoundary>
		</system.ThemeProvider>
	);
};

export default App;
