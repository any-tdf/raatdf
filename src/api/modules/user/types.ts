/**
 * 用户模块类型定义
 */

/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'user';

/**
 * 用户状态类型
 */
export type UserStatus = 'active' | 'disabled' | 'pending';

/**
 * 登录请求参数
 */
export interface LoginRequest {
	username: string;
	password: string;
	rememberMe?: boolean;
	captcha?: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
	accessToken: string;
	refreshToken?: string;
	expiresIn: number;
}

/**
 * 用户信息
 */
export interface UserInfo {
	id: string;
	username: string;
	email?: string;
	nickname?: string;
	avatar?: string;
	role: UserRole | string;
	permissions: string[];
	status?: UserStatus;
	createdAt?: string;
	lastLoginAt?: string;
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
	username: string;
	password: string;
	confirmPassword: string;
	email: string;
	nickname?: string;
	captcha?: string;
}

/**
 * 更新用户信息请求参数
 */
export interface UpdateUserRequest {
	nickname?: string;
	email?: string;
	avatar?: string;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
	username?: string;
	email?: string;
	role?: UserRole | string;
	status?: UserStatus;
	current?: number;
	pageSize?: number;
}

/**
 * 刷新令牌请求参数
 */
export interface RefreshTokenRequest {
	refreshToken: string;
}
