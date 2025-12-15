/**
 * API 接口类型定义
 */

/**
 * 用户相关类型
 */
export namespace User {
	export interface LoginRequest {
		username: string;
		password: string;
		rememberMe?: boolean;
	}

	export interface LoginResponse {
		accessToken: string;
		refreshToken?: string;
		expiresIn: number;
		user: UserInfo;
	}

	export interface UserInfo {
		id: string;
		username: string;
		email?: string;
		nickname?: string;
		avatar?: string;
		role: string;
		permissions: string[];
	}
}

/**
 * 通用错误响应
 */
export interface ApiError {
	code: number;
	message: string;
	details?: unknown;
}
