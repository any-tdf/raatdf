/**
 * 登录/注册页面多语言配置
 */

import type { Locale } from '@/locales/system/types';

interface AuthLocale {
	login: {
		title: string;
		subtitle: string;
		usernamePlaceholder: string;
		usernameRequired: string;
		passwordPlaceholder: string;
		passwordRequired: string;
		rememberMe: string;
		forgotPassword: string;
		loginButton: string;
		loggingIn: string;
		testAccount: string;
		menuTip: string;
		noAccount: string;
		registerNow: string;
		loginSuccess: string;
		loginFailed: string;
	};
	register: {
		title: string;
		subtitle: string;
		tagline: string;
		usernamePlaceholder: string;
		usernameRequired: string;
		usernameMinLength: string;
		usernameMaxLength: string;
		emailPlaceholder: string;
		emailRequired: string;
		emailInvalid: string;
		passwordPlaceholder: string;
		passwordRequired: string;
		passwordMinLength: string;
		confirmPasswordPlaceholder: string;
		confirmPasswordRequired: string;
		passwordMismatch: string;
		agreeTerms: string;
		termsPrefix: string;
		termsOfService: string;
		and: string;
		privacyPolicy: string;
		agreeRequired: string;
		registerButton: string;
		registering: string;
		hasAccount: string;
		loginNow: string;
		registerSuccess: string;
		registerFailed: string;
	};
}

const zhCN: AuthLocale = {
	login: {
		title: '欢迎回来',
		subtitle: '登录你的账户以继续',
		usernamePlaceholder: '用户名 / 邮箱',
		usernameRequired: '请输入用户名！',
		passwordPlaceholder: '密码',
		passwordRequired: '请输入密码！',
		rememberMe: '记住我',
		forgotPassword: '忘记密码？',
		loginButton: '立即登录',
		loggingIn: '登录中...',
		testAccount: '管理员：admin / 123456 | 普通用户：user / 123456',
		menuTip: '不同用户有不同的菜单和权限',
		noAccount: '还没有账户？',
		registerNow: '立即注册',
		loginSuccess: '登录成功！',
		loginFailed: '登录失败，请重试',
	},
	register: {
		title: '创建账户',
		subtitle: '加入我们，开启全新的管理体验',
		tagline: '加入我们，开启全新的管理体验',
		usernamePlaceholder: '用户名',
		usernameRequired: '请输入用户名！',
		usernameMinLength: '用户名至少 3 个字符！',
		usernameMaxLength: '用户名最多 20 个字符！',
		emailPlaceholder: '邮箱地址',
		emailRequired: '请输入邮箱！',
		emailInvalid: '请输入有效的邮箱地址！',
		passwordPlaceholder: '设置密码',
		passwordRequired: '请输入密码！',
		passwordMinLength: '密码至少 6 个字符！',
		confirmPasswordPlaceholder: '确认密码',
		confirmPasswordRequired: '请确认密码！',
		passwordMismatch: '两次输入的密码不一致！',
		agreeTerms: '我已阅读并同意',
		termsPrefix: '我已阅读并同意',
		termsOfService: '服务条款',
		and: '和',
		privacyPolicy: '隐私政策',
		agreeRequired: '请阅读并同意服务条款和隐私政策',
		registerButton: '立即注册',
		registering: '注册中...',
		hasAccount: '已有账户？',
		loginNow: '立即登录',
		registerSuccess: '注册成功！请登录',
		registerFailed: '注册失败，请重试',
	},
};

const enUS: AuthLocale = {
	login: {
		title: 'Welcome Back',
		subtitle: 'Sign in to your account to continue',
		usernamePlaceholder: 'Username / Email',
		usernameRequired: 'Please enter your username!',
		passwordPlaceholder: 'Password',
		passwordRequired: 'Please enter your password!',
		rememberMe: 'Remember me',
		forgotPassword: 'Forgot password?',
		loginButton: 'Sign In',
		loggingIn: 'Signing in...',
		testAccount: 'Admin: admin / 123456 | User: user / 123456',
		menuTip: 'Different users have different menus and permissions',
		noAccount: "Don't have an account?",
		registerNow: 'Sign Up',
		loginSuccess: 'Login successful!',
		loginFailed: 'Login failed, please try again',
	},
	register: {
		title: 'Create Account',
		subtitle: 'Join us for a brand new management experience',
		tagline: 'Join us for a brand new management experience',
		usernamePlaceholder: 'Username',
		usernameRequired: 'Please enter your username!',
		usernameMinLength: 'Username must be at least 3 characters!',
		usernameMaxLength: 'Username must be at most 20 characters!',
		emailPlaceholder: 'Email address',
		emailRequired: 'Please enter your email!',
		emailInvalid: 'Please enter a valid email address!',
		passwordPlaceholder: 'Set password',
		passwordRequired: 'Please enter your password!',
		passwordMinLength: 'Password must be at least 6 characters!',
		confirmPasswordPlaceholder: 'Confirm password',
		confirmPasswordRequired: 'Please confirm your password!',
		passwordMismatch: 'Passwords do not match!',
		agreeTerms: 'I have read and agree to the',
		termsPrefix: 'I have read and agree to the',
		termsOfService: 'Terms of Service',
		and: 'and',
		privacyPolicy: 'Privacy Policy',
		agreeRequired: 'Please read and agree to the Terms of Service and Privacy Policy',
		registerButton: 'Sign Up',
		registering: 'Signing up...',
		hasAccount: 'Already have an account?',
		loginNow: 'Sign In',
		registerSuccess: 'Registration successful! Please sign in',
		registerFailed: 'Registration failed, please try again',
	},
};

const locales: Record<Locale, AuthLocale> = {
	'zh-CN': zhCN,
	'en-US': enUS,
};

export const getAuthLocale = (locale: Locale): AuthLocale => {
	return locales[locale] || zhCN;
};

export default locales;
