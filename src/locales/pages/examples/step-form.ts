/**
 * 分步表单页国际化配置
 */

import type { Locale } from '@/locales/system/types';

export interface StepFormLocale {
	title: string;
	message: string;
	steps: {
		basic: string;
		team: string;
		confirm: string;
	};
	form: {
		projectName: string;
		projectNameRequired: string;
		projectType: string;
		projectTypeRequired: string;
		duration: string;
		durationRequired: string;
		leader: string;
		leaderRequired: string;
		budget: string;
		budgetRequired: string;
	};
	options: {
		typeA: string;
		typeB: string;
		zhangsan: string;
		lisi: string;
	};
	confirmText: string;
}

const stepFormZhCN: StepFormLocale = {
	title: '分步表单示例',
	message: '分步表单提交成功！',
	steps: {
		basic: '基本信息',
		team: '团队配置',
		confirm: '确认信息',
	},
	form: {
		projectName: '项目名称',
		projectNameRequired: '请输入项目名称',
		projectType: '项目类型',
		projectTypeRequired: '请选择项目类型',
		duration: '项目周期',
		durationRequired: '请选择项目周期',
		leader: '项目负责人',
		leaderRequired: '请选择项目负责人',
		budget: '预算金额',
		budgetRequired: '请输入预算金额',
	},
	options: {
		typeA: '类型 A',
		typeB: '类型 B',
		zhangsan: '张三',
		lisi: '李四',
	},
	confirmText: '请确认您填写的信息无误后提交',
};

const stepFormEnUS: StepFormLocale = {
	title: 'Step Form Example',
	message: 'Step form submitted successfully!',
	steps: {
		basic: 'Basic Information',
		team: 'Team Configuration',
		confirm: 'Confirmation',
	},
	form: {
		projectName: 'Project Name',
		projectNameRequired: 'Please enter project name',
		projectType: 'Project Type',
		projectTypeRequired: 'Please select project type',
		duration: 'Project Duration',
		durationRequired: 'Please select project duration',
		leader: 'Project Leader',
		leaderRequired: 'Please select project leader',
		budget: 'Budget Amount',
		budgetRequired: 'Please enter budget amount',
	},
	options: {
		typeA: 'Type A',
		typeB: 'Type B',
		zhangsan: 'Zhang San',
		lisi: 'Li Si',
	},
	confirmText: 'Please confirm that the information you entered is correct before submitting',
};

export const getStepFormLocale = (locale: Locale): StepFormLocale => {
	return locale === 'en-US' ? stepFormEnUS : stepFormZhCN;
};
