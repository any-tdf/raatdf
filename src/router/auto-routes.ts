/**
 * 路由自动生成模块
 * 使用 Vite 的 import.meta.glob 扫描 pages 目录，自动生成组件映射
 */

import { type ComponentType, lazy } from 'react';

/**
 * 使用 Vite glob 导入扫描所有页面文件
 * eager: false 表示懒加载
 */
const pageModules = import.meta.glob<{ default: ComponentType }>('../pages/**/*.tsx');

/**
 * 排除的路径模式
 * - /auth/ : 认证页面单独处理
 * - /_ : 下划线开头的为私有模块
 */
const EXCLUDED_PATTERNS = ['/auth/', '/_'];

/**
 * 检查文件是否应该被排除
 */
const shouldExclude = (filePath: string): boolean => {
	return EXCLUDED_PATTERNS.some((pattern) => filePath.includes(pattern));
};

/**
 * 将文件路径转换为路由路径
 * @example '../pages/dashboard/index.tsx' -> 'dashboard'
 * @example '../pages/examples/query-table.tsx' -> 'examples/query-table'
 * @example '../pages/errors/403.tsx' -> 'errors/403'
 */
const filePathToRoutePath = (filePath: string): string => {
	let routePath = filePath
		// 移除前缀
		.replace('../pages/', '')
		// 移除文件扩展名
		.replace(/\.tsx$/, '')
		// 移除结尾的 /index
		.replace(/\/index$/, '');

	// 处理动态路由：[id] -> :id
	routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');

	return routePath || 'index';
};

/**
 * 将文件路径转换为组件名称
 * @example '../pages/dashboard/index.tsx' -> 'Dashboard'
 * @example '../pages/examples/query-table.tsx' -> 'ExamplesQueryTable'
 * @example '../pages/errors/403.tsx' -> 'Errors403'
 */
const filePathToComponentName = (filePath: string): string => {
	const pathWithoutPrefix = filePath
		.replace('../pages/', '')
		.replace(/\.tsx$/, '')
		.replace(/\/index$/, '');

	if (!pathWithoutPrefix) {
		return 'Index';
	}

	// 将路径分割，然后转换为 PascalCase
	return pathWithoutPrefix
		.split('/')
		.map((part) => {
			// 处理连字符命名：query-table -> QueryTable
			return part
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
		})
		.join('');
};

/**
 * 生成组件映射表
 * 将文件路径映射为懒加载组件
 */
export const generateComponentMap = (): Record<string, React.LazyExoticComponent<ComponentType>> => {
	const componentMap: Record<string, React.LazyExoticComponent<ComponentType>> = {};

	for (const [filePath, importFn] of Object.entries(pageModules)) {
		// 跳过排除的文件
		if (shouldExclude(filePath)) {
			continue;
		}

		const componentName = filePathToComponentName(filePath);
		componentMap[componentName] = lazy(importFn);
	}

	return componentMap;
};

/**
 * 生成路由路径到组件的映射
 * 用于直接根据路径获取组件
 */
export const generateRouteMap = (): Record<string, React.LazyExoticComponent<ComponentType>> => {
	const routeMap: Record<string, React.LazyExoticComponent<ComponentType>> = {};

	for (const [filePath, importFn] of Object.entries(pageModules)) {
		// 跳过排除的文件
		if (shouldExclude(filePath)) {
			continue;
		}

		const routePath = filePathToRoutePath(filePath);
		routeMap[routePath] = lazy(importFn);
	}

	return routeMap;
};

/**
 * 获取所有自动生成的路由信息
 */
export const getAutoRoutes = (): Array<{
	path: string;
	componentName: string;
}> => {
	const routes: Array<{ path: string; componentName: string }> = [];

	for (const filePath of Object.keys(pageModules)) {
		if (shouldExclude(filePath)) {
			continue;
		}

		routes.push({
			path: filePathToRoutePath(filePath),
			componentName: filePathToComponentName(filePath),
		});
	}

	return routes;
};
