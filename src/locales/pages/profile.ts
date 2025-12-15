/**
 * 个人中心页面多语言配置
 */

import type { Locale } from '@/locales/system/types';

interface ProfileLocale {
	title: string;
	basicInfo: {
		title: string;
		edit: string;
		save: string;
		cancel: string;
		username: string;
		usernamePlaceholder: string;
		usernameRequired: string;
		email: string;
		emailPlaceholder: string;
		emailRequired: string;
		emailInvalid: string;
		phone: string;
		department: string;
		position: string;
		joinDate: string;
	};
	security: {
		title: string;
		password: string;
		passwordDescription: string;
		changePassword: string;
		boundEmail: string;
		boundEmailPrefix: string;
		changeEmail: string;
		boundPhone: string;
		boundPhonePrefix: string;
		changePhone: string;
	};
	messages: {
		updateSuccess: string;
		passwordChangeInDevelopment: string;
		emailChangeInDevelopment: string;
	};
}

const zhCN: ProfileLocale = {
	title: '个人中心',
	basicInfo: {
		title: '基本信息',
		edit: '编辑',
		save: '保存',
		cancel: '取消',
		username: '用户名',
		usernamePlaceholder: '请输入用户名',
		usernameRequired: '请输入用户名',
		email: '邮箱',
		emailPlaceholder: '请输入邮箱',
		emailRequired: '请输入邮箱',
		emailInvalid: '请输入有效的邮箱地址',
		phone: '手机号',
		department: '部门',
		position: '职位',
		joinDate: '入职日期',
	},
	security: {
		title: '安全设置',
		password: '登录密码',
		passwordDescription: '定期更换密码可以保护账户安全',
		changePassword: '修改密码',
		boundEmail: '绑定邮箱',
		boundEmailPrefix: '已绑定：',
		changeEmail: '更换邮箱',
		boundPhone: '绑定手机',
		boundPhonePrefix: '已绑定：',
		changePhone: '更换手机',
	},
	messages: {
		updateSuccess: '个人信息已更新',
		passwordChangeInDevelopment: '密码修改功能开发中',
		emailChangeInDevelopment: '邮箱修改功能开发中',
	},
};

const enUS: ProfileLocale = {
	title: 'Profile',
	basicInfo: {
		title: 'Basic Information',
		edit: 'Edit',
		save: 'Save',
		cancel: 'Cancel',
		username: 'Username',
		usernamePlaceholder: 'Please enter username',
		usernameRequired: 'Please enter username',
		email: 'Email',
		emailPlaceholder: 'Please enter email',
		emailRequired: 'Please enter email',
		emailInvalid: 'Please enter a valid email address',
		phone: 'Phone',
		department: 'Department',
		position: 'Position',
		joinDate: 'Join Date',
	},
	security: {
		title: 'Security Settings',
		password: 'Login Password',
		passwordDescription: 'Changing your password regularly can protect your account',
		changePassword: 'Change Password',
		boundEmail: 'Bound Email',
		boundEmailPrefix: 'Bound: ',
		changeEmail: 'Change Email',
		boundPhone: 'Bound Phone',
		boundPhonePrefix: 'Bound: ',
		changePhone: 'Change Phone',
	},
	messages: {
		updateSuccess: 'Profile updated successfully',
		passwordChangeInDevelopment: 'Password change feature is under development',
		emailChangeInDevelopment: 'Email change feature is under development',
	},
};

const locales: Record<Locale, ProfileLocale> = {
	'zh-CN': zhCN,
	'en-US': enUS,
};

export const getProfileLocale = (locale: Locale): ProfileLocale => {
	return locales[locale] || zhCN;
};

export default locales;
