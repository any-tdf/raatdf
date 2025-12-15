/**
 * 查询表格页国际化配置
 */

import type { Locale } from '@/locales/system/types';

interface QueryTableLocale {
	title: string;
	addEmployee: string;
	batchDelete: string;
	batchExport: string;
	selected: string;
	columns: {
		employeeNo: string;
		name: string;
		department: string;
		position: string;
		email: string;
		phone: string;
		status: string;
		joinDate: string;
		joinDateRange: string;
		salary: string;
		action: string;
	};
	departments: {
		tech: string;
		product: string;
		marketing: string;
		sales: string;
		hr: string;
		finance: string;
	};
	positions: {
		junior: string;
		intermediate: string;
		senior: string;
		expert: string;
		manager: string;
		director: string;
	};
	status: {
		active: string;
		inactive: string;
		leave: string;
	};
	actions: {
		view: string;
		edit: string;
		delete: string;
		disable: string;
	};
	form: {
		name: string;
		nameRequired: string;
		employeeNo: string;
		employeeNoRequired: string;
		department: string;
		departmentRequired: string;
		position: string;
		positionRequired: string;
		email: string;
		emailRequired: string;
		emailInvalid: string;
		phone: string;
		phoneRequired: string;
		phoneInvalid: string;
		status: string;
		statusRequired: string;
		joinDate: string;
		joinDateRequired: string;
		salary: string;
		salaryRequired: string;
	};
	buttons: {
		submit: string;
		cancel: string;
	};
	messages: {
		deleteConfirm: string;
		deleteSuccess: string;
		batchDeleteConfirm: string;
		batchDeleteSuccess: string;
		addSuccess: string;
		updateSuccess: string;
		exportSuccess: string;
	};
	pagination: {
		total: string;
	};
	modal: {
		addTitle: string;
		editTitle: string;
	};
}

const zhCN: QueryTableLocale = {
	title: '员工管理',
	addEmployee: '新增员工',
	batchDelete: '批量删除',
	batchExport: '批量导出',
	selected: '已选择 {count} 项',
	columns: {
		employeeNo: '工号',
		name: '姓名',
		department: '部门',
		position: '职位',
		email: '邮箱',
		phone: '手机号',
		status: '状态',
		joinDate: '入职日期',
		joinDateRange: '入职日期区间',
		salary: '薪资',
		action: '操作',
	},
	departments: {
		tech: '技术部',
		product: '产品部',
		marketing: '市场部',
		sales: '销售部',
		hr: '人力资源部',
		finance: '财务部',
	},
	positions: {
		junior: '初级工程师',
		intermediate: '中级工程师',
		senior: '高级工程师',
		expert: '技术专家',
		manager: '经理',
		director: '总监',
	},
	status: {
		active: '在职',
		inactive: '离职',
		leave: '休假',
	},
	actions: {
		view: '查看',
		edit: '编辑',
		delete: '删除',
		disable: '禁用',
	},
	form: {
		name: '姓名',
		nameRequired: '请输入姓名',
		employeeNo: '工号',
		employeeNoRequired: '请输入工号',
		department: '部门',
		departmentRequired: '请选择部门',
		position: '职位',
		positionRequired: '请选择职位',
		email: '邮箱',
		emailRequired: '请输入邮箱',
		emailInvalid: '邮箱格式不正确',
		phone: '手机号',
		phoneRequired: '请输入手机号',
		phoneInvalid: '手机号格式不正确',
		status: '状态',
		statusRequired: '请选择状态',
		joinDate: '入职日期',
		joinDateRequired: '请选择入职日期',
		salary: '薪资',
		salaryRequired: '请输入薪资',
	},
	buttons: {
		submit: '提交',
		cancel: '取消',
	},
	messages: {
		deleteConfirm: '确定要删除该员工吗？',
		deleteSuccess: '删除成功',
		batchDeleteConfirm: '确定要删除选中的 {count} 个员工吗？',
		batchDeleteSuccess: '批量删除成功',
		addSuccess: '新增成功',
		updateSuccess: '更新成功',
		exportSuccess: '导出成功',
	},
	pagination: {
		total: '共 {total} 条',
	},
	modal: {
		addTitle: '新增员工',
		editTitle: '编辑员工',
	},
};

const enUS: QueryTableLocale = {
	title: 'Employee Management',
	addEmployee: 'Add Employee',
	batchDelete: 'Batch Delete',
	batchExport: 'Batch Export',
	selected: '{count} items selected',
	columns: {
		employeeNo: 'Employee No.',
		name: 'Name',
		department: 'Department',
		position: 'Position',
		email: 'Email',
		phone: 'Phone',
		status: 'Status',
		joinDate: 'Join Date',
		joinDateRange: 'Join Date Range',
		salary: 'Salary',
		action: 'Action',
	},
	departments: {
		tech: 'Technology',
		product: 'Product',
		marketing: 'Marketing',
		sales: 'Sales',
		hr: 'Human Resources',
		finance: 'Finance',
	},
	positions: {
		junior: 'Junior Engineer',
		intermediate: 'Intermediate Engineer',
		senior: 'Senior Engineer',
		expert: 'Technical Expert',
		manager: 'Manager',
		director: 'Director',
	},
	status: {
		active: 'Active',
		inactive: 'Inactive',
		leave: 'On Leave',
	},
	actions: {
		view: 'View',
		edit: 'Edit',
		delete: 'Delete',
		disable: 'Disable',
	},
	form: {
		name: 'Name',
		nameRequired: 'Please enter name',
		employeeNo: 'Employee No.',
		employeeNoRequired: 'Please enter employee number',
		department: 'Department',
		departmentRequired: 'Please select department',
		position: 'Position',
		positionRequired: 'Please select position',
		email: 'Email',
		emailRequired: 'Please enter email',
		emailInvalid: 'Invalid email format',
		phone: 'Phone',
		phoneRequired: 'Please enter phone number',
		phoneInvalid: 'Invalid phone format',
		status: 'Status',
		statusRequired: 'Please select status',
		joinDate: 'Join Date',
		joinDateRequired: 'Please select join date',
		salary: 'Salary',
		salaryRequired: 'Please enter salary',
	},
	buttons: {
		submit: 'Submit',
		cancel: 'Cancel',
	},
	messages: {
		deleteConfirm: 'Are you sure to delete this employee?',
		deleteSuccess: 'Deleted successfully',
		batchDeleteConfirm: 'Are you sure to delete {count} employees?',
		batchDeleteSuccess: 'Batch deleted successfully',
		addSuccess: 'Added successfully',
		updateSuccess: 'Updated successfully',
		exportSuccess: 'Exported successfully',
	},
	pagination: {
		total: 'Total {total} items',
	},
	modal: {
		addTitle: 'Add Employee',
		editTitle: 'Edit Employee',
	},
};

const locales: Record<Locale, QueryTableLocale> = {
	'zh-CN': zhCN,
	'en-US': enUS,
};

export const getQueryTableLocale = (locale: Locale): QueryTableLocale => {
	return locales[locale] || zhCN;
};

export default locales;
