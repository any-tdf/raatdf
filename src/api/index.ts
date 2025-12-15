/**
 * API 模块统一导出
 *
 * 此文件是所有 API 模块的统一入口
 *
 * @example
 * import { userApi, employeeApi } from '@/api';
 */

// 导出员工 API 模块
export { employeeApi } from './modules/employee';
// 导出员工模块类型
export type { Employee, EmployeeListParams, EmployeeListResponse } from './modules/employee/types';
// 导出用户 API 模块
export { userApi } from './modules/user';
// 导出用户模块类型
export type {
	ChangePasswordRequest,
	LoginRequest,
	LoginResponse,
	RefreshTokenRequest,
	RegisterRequest,
	UpdateUserRequest,
	UserInfo,
	UserListParams,
	UserRole,
	UserStatus,
} from './modules/user/types';
