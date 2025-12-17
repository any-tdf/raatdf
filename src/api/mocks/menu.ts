/**
 * 菜单项模拟数据 - 模拟后端接口返回
 * 实际项目中，这些数据应该从后端 API 获取
 */

import type { Locale } from '@/store/types';

/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'user';

export interface MenuItem {
	key: string;
	label: string;
	icon?: string;
	path?: string;
	children?: MenuItem[];
	component?: string;
	/** 允许访问此菜单的角色，不设置则所有角色都可访问 */
	roles?: UserRole[];
}

/**
 * 简体中文菜单数据
 */
const menuDataZhCN: MenuItem[] = [
	{
		key: 'dashboard',
		label: '仪表盘',
		icon: 'ri-dashboard-3-line',
		path: '/dashboard',
		children: [],
		component: 'Dashboard',
		roles: ['admin', 'user'],
	},
	{
		key: 'profile',
		label: '个人中心',
		icon: 'ri-user-line',
		path: '/profile',
		children: [],
		component: 'Profile',
		roles: ['admin', 'user'],
	},
	{
		key: 'docs',
		label: '项目文档',
		icon: 'ri-book-read-line',
		path: '/docs',
		children: [],
		component: 'Docs',
		roles: ['admin', 'user'],
	},
	{
		key: 'examples',
		label: '示例页面',
		icon: 'ri-file-list-3-line',
		roles: ['admin'],
		children: [
			{
				key: 'query-table',
				label: '查询表格',
				icon: 'ri-table-line',
				path: '/examples/query-table',
				children: [],
				component: 'ExamplesQueryTable',
			},
			{
				key: 'step-form',
				label: '分步表单',
				icon: 'ri-list-check-2',
				path: '/examples/step-form',
				children: [],
				component: 'ExamplesStepForm',
			},
		],
	},
	{
		key: 'errors',
		label: '异常页面',
		icon: 'ri-error-warning-line',
		roles: ['admin'],
		children: [
			{
				key: 'error-403',
				label: '403 页面',
				path: '/errors/403',
				children: [],
				component: 'Forbidden',
			},
			{
				key: 'error-404',
				label: '404 页面',
				path: '/errors/404',
				children: [],
				component: 'NotFound',
			},
			{
				key: 'error-500',
				label: '500 页面',
				path: '/errors/500',
				children: [],
				component: 'ServerError',
			},
		],
	},
];

/**
 * 英文菜单数据
 */
const menuDataEnUS: MenuItem[] = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		icon: 'ri-dashboard-3-line',
		path: '/dashboard',
		children: [],
		component: 'Dashboard',
		roles: ['admin', 'user'],
	},
	{
		key: 'profile',
		label: 'Profile',
		icon: 'ri-user-line',
		path: '/profile',
		children: [],
		component: 'Profile',
		roles: ['admin', 'user'],
	},
	{
		key: 'docs',
		label: 'Documentation',
		icon: 'ri-book-read-line',
		path: '/docs',
		children: [],
		component: 'Docs',
		roles: ['admin', 'user'],
	},
	{
		key: 'examples',
		label: 'Example Pages',
		icon: 'ri-file-list-3-line',
		roles: ['admin'],
		children: [
			{
				key: 'query-table',
				label: 'Query Table',
				icon: 'ri-table-line',
				path: '/examples/query-table',
				children: [],
				component: 'ExamplesQueryTable',
			},
			{
				key: 'step-form',
				label: 'Step Form',
				icon: 'ri-list-check-2',
				path: '/examples/step-form',
				children: [],
				component: 'ExamplesStepForm',
			},
		],
	},
	{
		key: 'errors',
		label: 'Error Pages',
		icon: 'ri-error-warning-line',
		roles: ['admin'],
		children: [
			{
				key: 'error-403',
				label: '403 Page',
				path: '/errors/403',
				children: [],
				component: 'Forbidden',
			},
			{
				key: 'error-404',
				label: '404 Page',
				path: '/errors/404',
				children: [],
				component: 'NotFound',
			},
			{
				key: 'error-500',
				label: '500 Page',
				path: '/errors/500',
				children: [],
				component: 'ServerError',
			},
		],
	},
];

/**
 * 根据角色过滤菜单数据
 * @param menuData 原始菜单数据
 * @param role 用户角色
 * @returns 过滤后的菜单数据
 */
export const filterMenuByRole = (menuData: MenuItem[], role: UserRole): MenuItem[] => {
	return (
		menuData
			.filter((item) => {
				// 如果没有设置 roles，则所有角色都可访问
				if (!item.roles || item.roles.length === 0) {
					return true;
				}
				return item.roles.includes(role);
			})
			.map((item) => ({
				...item,
				// 递归过滤子菜单
				children: item.children ? filterMenuByRole(item.children, role) : undefined,
			}))
			// 过滤掉没有子菜单的父级菜单（如果原本有子菜单的话）
			.filter((item) => {
				if (item.children && item.children.length === 0 && !item.path) {
					return false;
				}
				return true;
			})
	);
};

/**
 * 菜单数据映射
 */
const menuDataMap = {
	'zh-CN': menuDataZhCN,
	'en-US': menuDataEnUS,
} as const;

/**
 * 获取指定语言的菜单数据
 * 模拟后端接口调用
 * @param locale 语言设置
 * @param role 用户角色，默认为 admin
 */
export const getMenuData = (locale: Locale, role: UserRole = 'admin'): MenuItem[] => {
	const fullMenu = menuDataMap[locale] || menuDataZhCN;
	return filterMenuByRole(fullMenu, role);
};

/**
 * 模拟 API 请求获取菜单数据
 * @param locale 语言设置
 * @param role 用户角色
 * @returns Promise 返回菜单数据
 */
export const fetchMenuData = async (locale: Locale, role: UserRole = 'admin'): Promise<MenuItem[]> => {
	// 模拟 API 延迟
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(getMenuData(locale, role));
		}, 300);
	});
};

export default getMenuData;
