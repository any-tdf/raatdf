/**
 * 示例页面 Mock 数据生成器
 */

// ============ 查询表格页 Mock 数据 ============
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

// 中英文混合的名字
const names = [
	'张伟',
	'李娜',
	'王芳',
	'刘强',
	'陈静',
	'杨明',
	'John Smith',
	'Sarah Johnson',
	'Michael Brown',
	'Emily Davis',
	'David Wilson',
	'Jessica Martinez',
	'赵敏',
	'周杰',
	'吴磊',
	'Robert Taylor',
	'Linda Anderson',
	'James Thomas',
	'Mary Garcia',
	'William Robinson',
];

const departments = ['tech', 'product', 'marketing', 'sales', 'hr', 'finance'];
const positions = ['junior', 'intermediate', 'senior', 'expert', 'manager', 'director'];

/**
 * 生成员工列表 Mock 数据
 * @param count 生成数量，默认 50
 */
export const generateEmployees = (count = 50): Employee[] => {
	return Array.from({ length: count }, (_, i) => {
		const name = names[i % names.length];
		const isEnglishName = /^[A-Za-z\s]+$/.test(name);

		// 根据名字类型生成对应的邮箱
		const emailPrefix = isEnglishName ? name.toLowerCase().replace(/\s+/g, '.') : `user${i + 1}`;

		return {
			id: `EMP${String(i + 1).padStart(4, '0')}`,
			name,
			employeeNo: `E${String(i + 1).padStart(6, '0')}`,
			department: departments[Math.floor(Math.random() * departments.length)],
			position: positions[Math.floor(Math.random() * positions.length)],
			email: `${emailPrefix}@company.com`,
			status: ['active', 'inactive', 'leave'][Math.floor(Math.random() * 3)] as Employee['status'],
			joinDate: new Date(
				2020 + Math.floor(Math.random() * 5),
				Math.floor(Math.random() * 12),
				Math.floor(Math.random() * 28) + 1
			)
				.toISOString()
				.split('T')[0],
		};
	});
};
