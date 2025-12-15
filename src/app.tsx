import { Spin } from 'antd';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { MenuItem } from '@/api/mocks/menu';
import { userApi } from '@/api/modules/user';
import { system } from '@/components';
import AppLayout from '@/layouts/app-layout';
import { getCommonLocale } from '@/locales';
import Auth from '@/pages/auth/index';
import Forbidden from '@/pages/errors/403';
import NotFound from '@/pages/errors/404';
import ServerError from '@/pages/errors/500';
import { generateComponentMap } from '@/router/auto-routes';
import { useMenuStore, useSystemStore, useUserStore } from '@/store';

// 自动生成组件映射（基于 pages 目录结构）
const autoComponentMap = generateComponentMap();

// 错误页面需要显式导入（用于 fallback 和直接访问）
const componentMap: Record<string, React.ComponentType> = {
	...autoComponentMap,
	// 显式覆盖错误页面，确保非懒加载
	Forbidden,
	NotFound,
	ServerError,
};

// 从菜单数据生成路由
const generateRoutes = (items: MenuItem[]): React.ReactElement[] => {
	const routes: React.ReactElement[] = [];

	for (const item of items) {
		if (item.children && item.children.length > 0) {
			// 先递归处理子菜单
			routes.push(...generateRoutes(item.children));
		}

		// 如果当前项有路径和组件，创建路由
		if (item.path && item.component) {
			// 移除开头的 / 使其成为相对路径
			const relativePath = item.path.startsWith('/') ? item.path.slice(1) : item.path;

			routes.push(
				<Route
					key={item.key}
					path={relativePath}
					element={
						<Suspense fallback={<div>Loading...</div>}>
							{componentMap[item.component] ? React.createElement(componentMap[item.component]) : <NotFound />}
						</Suspense>
					}
				/>
			);
		}
	}

	return routes;
};

// 内部路由组件 - 处理认证检查和重定向
function AppRoutes({ isAuthenticated, checkingAuth }: { isAuthenticated: boolean; checkingAuth: boolean }) {
	const location = useLocation();
	const { locale, menuData } = useSystemStore();
	const { isLoggedIn } = useUserStore();

	// 正在检查认证状态
	if (checkingAuth) {
		const t = getCommonLocale(locale);
		return (
			<Spin
				size="large"
				tip={t.loading.checkingAuth}
				style={{ backgroundColor: 'var(--ant-color-bg-container)' }}
				className="flex min-h-screen items-center justify-center"
			>
				<div className="h-screen w-full" />
			</Spin>
		);
	}

	// 基于 token 或 store 中的 isLoggedIn 来判断是否已认证
	// 如果 isLoggedIn 为 false，说明用户已主动退出，即使有 token 也认为未认证
	const actuallyAuthenticated = isLoggedIn && (isAuthenticated || !!localStorage.getItem('auth_token'));

	// 未认证且不在登录/注册页 - 重定向到登录页
	if (!actuallyAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
		return <Navigate to="/login" replace />;
	}

	// 已认证且在登录/注册页 - 重定向到首页
	if (actuallyAuthenticated && (location.pathname.startsWith('/login') || location.pathname.startsWith('/register'))) {
		return <Navigate to="/dashboard" replace />;
	}

	// 正常路由
	return (
		<Routes>
			{/* 公开路由 - 不使用布局 */}
			<Route path="/login" element={<Auth />} />
			<Route path="/register" element={<Auth />} />

			{/* 受保护的路由 - 使用布局 */}
			<Route
				path="/"
				element={
					<Suspense fallback={<div>Loading...</div>}>
						<system.ProtectedRoute>
							<AppLayout />
						</system.ProtectedRoute>
					</Suspense>
				}
			>
				{generateRoutes(menuData)}
				<Route path="" element={<Navigate to="dashboard" replace />} />
				<Route path="*" element={<NotFound />} />
			</Route>

			{/* 404 路由 */}
			<Route path="*" element={<Navigate to={actuallyAuthenticated ? '/404' : '/login'} replace />} />
		</Routes>
	);
}

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);

	const { setUserInfo } = useUserStore();
	const { setMenuData } = useSystemStore();
	const { setMenuData: setMenuStoreData } = useMenuStore();

	// 检查登录状态并获取用户信息
	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem('auth_token');

			if (token) {
				// 1. 获取用户信息
				const profileResponse = await userApi.getProfile(token);
				if (!profileResponse.data) {
					setCheckingAuth(false);
					return;
				}
				const user = profileResponse.data;

				// 保存用户信息到 Zustand store
				setUserInfo({
					username: user.username,
					email: user.email || '',
					role: user.role as 'admin' | 'user',
					avatar: user.avatar,
				});

				// 2. 获取菜单数据
				const menuResponse = await userApi.getMenu(token);
				if (!menuResponse.data) {
					setCheckingAuth(false);
					return;
				}
				const menuDataFromApi = menuResponse.data;

				// 同时更新两个 store 的菜单数据，确保数据同步
				setMenuData(menuDataFromApi);
				setMenuStoreData(menuDataFromApi);

				// 3. 两个接口都完成后才结束加载
				setIsAuthenticated(true);
				setCheckingAuth(false);
			} else {
				// 没有 token
				setCheckingAuth(false);
			}
		};

		initAuth();
	}, [setUserInfo, setMenuData, setMenuStoreData]);

	return (
		<BrowserRouter>
			<system.ThemeProvider>
				<system.TabContextMenu />
				<AppRoutes isAuthenticated={isAuthenticated} checkingAuth={checkingAuth} />
			</system.ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
