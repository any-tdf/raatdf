/**
 * 员工模块 API
 */

import { generateEmployees } from '@/api/mocks/examples';
import type { ApiResponse } from '@/utils/http';
import type { Employee, EmployeeListParams, EmployeeListResponse } from './types';

// 模拟内存数据存储
const mockEmployees: Employee[] = generateEmployees(50);

/**
 * 员工 API 模块
 */
export const employeeApi = {
	/**
	 * 获取员工列表
	 * @param params 查询参数
	 * @returns 员工列表
	 */
	async getList(params: EmployeeListParams = {}): Promise<ApiResponse<EmployeeListResponse>> {
		await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟网络延迟

		const { name, department, position, status, current = 1, pageSize = 10 } = params;

		// 过滤数据
		let filteredList = [...mockEmployees];

		if (name) {
			filteredList = filteredList.filter((emp) => emp.name.includes(name));
		}
		if (department) {
			filteredList = filteredList.filter((emp) => emp.department === department);
		}
		if (position) {
			filteredList = filteredList.filter((emp) => emp.position === position);
		}
		if (status) {
			filteredList = filteredList.filter((emp) => emp.status === status);
		}

		// 分页
		const total = filteredList.length;
		const start = (current - 1) * pageSize;
		const end = start + pageSize;
		const list = filteredList.slice(start, end);

		return {
			code: 200,
			message: '获取成功',
			data: {
				list,
				total,
			},
			success: true,
		};
	},
};

export default employeeApi;
