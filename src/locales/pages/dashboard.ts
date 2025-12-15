/**
 * 仪表盘页面多语言配置
 */

import type { Locale } from '@/locales/system/types';

interface DashboardLocale {
	title: string;
	stats: {
		totalSales: string;
		orderCount: string;
		customerCount: string;
		productCount: string;
	};
	systemPerformance: {
		title: string;
		cpuUsage: string;
		memoryUsage: string;
		diskSpace: string;
	};
	businessTrends: {
		title: string;
		salesGrowth: string;
		newCustomerGrowth: string;
		orderCompletionRate: string;
		customerSatisfaction: string;
	};
}

const zhCN: DashboardLocale = {
	title: '仪表盘总览 📊',
	stats: {
		totalSales: '总销售额',
		orderCount: '订单数量',
		customerCount: '客户总数',
		productCount: '产品数量',
	},
	systemPerformance: {
		title: '系统性能',
		cpuUsage: 'CPU 使用率',
		memoryUsage: '内存占用',
		diskSpace: '磁盘空间',
	},
	businessTrends: {
		title: '本月业务趋势',
		salesGrowth: '销售增长率',
		newCustomerGrowth: '新客户增长率',
		orderCompletionRate: '订单完成率',
		customerSatisfaction: '客户满意度',
	},
};

const enUS: DashboardLocale = {
	title: 'Dashboard Overview 📊',
	stats: {
		totalSales: 'Total Sales',
		orderCount: 'Order Count',
		customerCount: 'Total Customers',
		productCount: 'Product Count',
	},
	systemPerformance: {
		title: 'System Performance',
		cpuUsage: 'CPU Usage',
		memoryUsage: 'Memory Usage',
		diskSpace: 'Disk Space',
	},
	businessTrends: {
		title: 'Monthly Business Trends',
		salesGrowth: 'Sales Growth',
		newCustomerGrowth: 'New Customer Growth',
		orderCompletionRate: 'Order Completion Rate',
		customerSatisfaction: 'Customer Satisfaction',
	},
};

const locales: Record<Locale, DashboardLocale> = {
	'zh-CN': zhCN,
	'en-US': enUS,
};

export const getDashboardLocale = (locale: Locale): DashboardLocale => {
	return locales[locale] || zhCN;
};

export default locales;
