/**
 * 员工模块类型定义
 */

/**
 * 员工信息接口
 */
export interface Employee {
	id: string;
	name: string;
	employeeNo: string;
	department: string;
	position: string;
	email: string;
	status: 'active' | 'inactive' | 'leave';
	joinDate: string;
}

/**
 * 查询员工列表参数
 */
export interface EmployeeListParams {
	/** 员工姓名（模糊搜索） */
	name?: string;
	/** 部门 */
	department?: string;
	/** 职位 */
	position?: string;
	/** 状态 */
	status?: 'active' | 'inactive' | 'leave';
	/** 当前页码 */
	current?: number;
	/** 每页数量 */
	pageSize?: number;
}

/**
 * 员工列表响应
 */
export interface EmployeeListResponse {
	list: Employee[];
	total: number;
}
