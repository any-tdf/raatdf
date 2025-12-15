import { message } from 'antd';
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import type { Locale } from '@/locales';
import { getCommonLocale } from '@/locales';
import { useSystemStore } from '@/store';

/**
 * HTTP 响应数据结构
 */
export interface ApiResponse<T = unknown> {
	code: number;
	message: string;
	data?: T;
	success: boolean;
}

/**
 * HTTP 错误响应结构
 */
export interface ApiErrorResponse {
	code: number;
	message: string;
	details?: string;
}

/**
 * 请求配置扩展
 */
export interface RequestConfig extends InternalAxiosRequestConfig {
	hideErrorMessage?: boolean;
	hideLoadingMessage?: boolean;
	timeout?: number;
}

/**
 * API 基础配置
 */
const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	timeout: 30000, // 默认超时时间 30 秒
	withCredentials: true, // 允许跨域请求带上认证信息
};

/**
 * 根据 HTTP 状态码获取本地化错误消息
 */
const getErrorMessageByStatus = (status: number, locale: Locale): string => {
	const commonLocale = getCommonLocale(locale);
	const { api } = commonLocale;

	switch (status) {
		case 400:
			return api.badRequest;
		case 401:
			return api.unauthorized;
		case 403:
			return api.forbidden;
		case 404:
			return api.notFound;
		case 408:
			return api.timeout;
		case 409:
			return api.conflict;
		case 422:
			return api.validationError;
		case 500:
			return api.serverError;
		case 502:
			return api.gatewayError;
		case 503:
			return api.serviceUnavailable;
		default:
			return api.unknownError;
	}
};

/**
 * 获取网络错误的本地化消息
 */
const getNetworkErrorMessage = (errorType: 'timeout' | 'connection' | 'network', locale: Locale): string => {
	const commonLocale = getCommonLocale(locale);
	const { api } = commonLocale;

	switch (errorType) {
		case 'timeout':
			return api.timeout;
		case 'connection':
			return api.connectionError;
		case 'network':
			return api.networkError;
		default:
			return api.unknownError;
	}
};

/**
 * 创建 axios 实例
 */
const httpClient: AxiosInstance = axios.create({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
	withCredentials: API_CONFIG.withCredentials,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
	},
});

/**
 * 请求拦截器
 * - 添加认证 token
 * - 处理请求超时
 * - 统一请求头配置
 */
httpClient.interceptors.request.use(
	(config: RequestConfig) => {
		// 获取存储的 token
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// 添加请求时间戳，防止浏览器缓存
		config.headers['X-Request-Time'] = Date.now().toString();

		// 添加请求 ID，方便追踪日志
		const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
		config.headers['X-Request-ID'] = requestId;

		// 超时配置通过 API_CONFIG 中的全局配置设置
		// 单个请求可通过 config.timeout 参数覆盖全局超时设置

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

/**
 * 响应拦截器
 * - 统一处理响应数据
 * - 错误消息提示
 * - 自动重试失败请求
 */
httpClient.interceptors.response.use(
	(response: AxiosResponse<ApiResponse>) => {
		const { data, config } = response;
		const requestConfig = config as RequestConfig;

		// 业务成功判断：满足以下任一条件即为成功
		// - code 字段为 0（表示成功）
		// - success 字段为 true
		if (data?.code === 0 || data?.success === true) {
			// 返回响应对象，保持 axios 类型兼容性
			return response;
		}

		// 业务失败，显示错误信息
		const errorMessage = data?.message || '请求失败，请重试';
		if (!requestConfig.hideErrorMessage) {
			message.error(errorMessage);
		}

		return Promise.reject({
			code: data?.code || -1,
			message: errorMessage,
			details: data,
		});
	},
	(error: AxiosError) => {
		const config = error.config as RequestConfig;

		// 检查是否需要隐藏错误提示
		if (config?.hideErrorMessage) {
			return Promise.reject(error);
		}

		// 获取当前语言
		const locale = useSystemStore.getState().locale as Locale;

		// 处理不同类型的错误
		let errorMessage: string;

		if (error.response) {
			const { status, data } = error.response;
			const errorData = data as ApiErrorResponse;

			// 优先使用服务器返回的错误消息，其次使用本地化消息
			errorMessage = errorData?.message || getErrorMessageByStatus(status, locale);

			// 401 错误时清除 token
			if (status === 401) {
				localStorage.removeItem('auth_token');
				// TODO: 重定向到登录页
			}
		} else if (error.request) {
			// 请求已发出，但没有收到响应
			errorMessage = getNetworkErrorMessage('connection', locale);
		} else if (error.message === 'Network Error') {
			errorMessage = getNetworkErrorMessage('network', locale);
		} else {
			// 未知错误类型，使用默认错误消息（-1 作为未知状态码）
			errorMessage = getErrorMessageByStatus(-1, locale);
		}

		message.error(errorMessage);

		return Promise.reject({
			code: error.response?.status || -1,
			message: errorMessage,
		});
	}
);

export default httpClient;
export { API_CONFIG };
