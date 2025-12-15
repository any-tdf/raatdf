import type { ProColumns } from '@ant-design/pro-components';
import { DrawerForm, ProFormDatePicker, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import type { Employee } from '@/api';
import { employeeApi } from '@/api';
import { getAntdLocale, getDatePickerLocale, getQueryTableLocale } from '@/locales';
import { useSystemStore } from '@/store';

/**
 * 查询表格参数接口
 */
interface QueryTableParams {
	name?: string;
	department?: string;
	position?: string;
	status?: 'active' | 'inactive' | 'leave';
	current?: number;
	pageSize?: number;
}

/**
 * 表单提交值接口
 */
interface FormSubmitValues {
	name?: string;
	department?: string;
	position?: string;
	status?: 'active' | 'inactive' | 'leave';
	[key: string]: unknown;
}

function ExamplesQueryTable() {
	const { locale } = useSystemStore();
	const t = getQueryTableLocale(locale);
	const { message } = App.useApp();
	const antdLocale = getAntdLocale(locale);

	const [drawerVisible, setDrawerVisible] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
	// biome-ignore lint/suspicious/noExplicitAny: ProTable actionRef 类型
	const actionRef = useRef<any>(null);

	// 获取当前语言的 DatePicker locale
	const datePickerLocale = getDatePickerLocale(locale);

	// 获取员工列表数据
	const fetchEmployeeList = async (params: QueryTableParams) => {
		const response = await employeeApi.getList({
			name: params.name,
			department: params.department,
			position: params.position,
			status: params.status,
			current: params.current,
			pageSize: params.pageSize,
		});

		if (response.success && response.data) {
			return {
				data: response.data.list,
				total: response.data.total,
				success: true,
			};
		}

		return {
			data: [],
			total: 0,
			success: false,
		};
	};

	// 新增员工
	const handleAdd = () => {
		setEditingEmployee(null);
		setDrawerVisible(true);
	};

	// 编辑员工
	const handleEdit = (record: Employee) => {
		setEditingEmployee(record);
		setDrawerVisible(true);
	};

	// 删除员工
	const handleDelete = (_record: Employee) => {
		// 前端本地删除，然后刷新表格
		message.success(t.messages.deleteSuccess);
		actionRef.current?.reload();
	};

	// 提交表单
	const handleSubmit = async (_values: FormSubmitValues) => {
		if (editingEmployee) {
			// 编辑模式 - 前端本地处理
			message.success(t.messages.updateSuccess);
		} else {
			// 新增模式 - 前端本地处理
			message.success(t.messages.addSuccess);
		}
		// 刷新表格
		actionRef.current?.reload();
		return true;
	};

	// 表格列配置
	const columns: ProColumns<Employee>[] = [
		{
			title: t.columns.employeeNo,
			dataIndex: 'employeeNo',
			width: 120,
			search: false,
		},
		{
			title: t.columns.name,
			dataIndex: 'name',
			width: 100,
		},
		{
			title: t.columns.department,
			dataIndex: 'department',
			width: 120,
			valueType: 'select',
			valueEnum: {
				tech: { text: t.departments.tech },
				product: { text: t.departments.product },
				marketing: { text: t.departments.marketing },
				sales: { text: t.departments.sales },
				hr: { text: t.departments.hr },
				finance: { text: t.departments.finance },
			},
		},
		{
			title: t.columns.position,
			dataIndex: 'position',
			width: 120,
			valueType: 'select',
			valueEnum: {
				junior: { text: t.positions.junior },
				intermediate: { text: t.positions.intermediate },
				senior: { text: t.positions.senior },
				expert: { text: t.positions.expert },
				manager: { text: t.positions.manager },
				director: { text: t.positions.director },
			},
		},
		{
			title: t.columns.email,
			dataIndex: 'email',
			width: 200,
			ellipsis: true,
			search: false,
		},
		{
			title: t.columns.status,
			dataIndex: 'status',
			width: 100,
			valueType: 'select',
			valueEnum: {
				active: {
					text: t.status.active,
					status: 'Success',
				},
				inactive: {
					text: t.status.inactive,
					status: 'Default',
				},
				leave: {
					text: t.status.leave,
					status: 'Warning',
				},
			},
		},
		{
			title: t.columns.joinDate,
			dataIndex: 'joinDate',
			width: 120,
			valueType: 'date',
			search: false,
		},
		{
			title: t.columns.joinDateRange,
			dataIndex: 'joinDateRange',
			valueType: 'dateRange',
			hideInTable: true,
			fieldProps: {
				locale: datePickerLocale,
			},
		},
		{
			title: t.columns.action,
			valueType: 'option',
			width: 120,
			fixed: 'right',
			render: (_, record) => [
				<Button key="edit" type="link" onClick={() => handleEdit(record)}>
					{t.actions.edit}
				</Button>,
				<Popconfirm
					key="delete"
					title={t.messages.deleteConfirm}
					onConfirm={() => handleDelete(record)}
					okText={t.buttons.submit}
					cancelText={t.buttons.cancel}
				>
					<Button type="link" danger>
						{t.actions.delete}
					</Button>
				</Popconfirm>,
			],
		},
	];

	return (
		<>
			<ProTable<Employee>
				columns={columns}
				actionRef={actionRef}
				request={fetchEmployeeList}
				rowKey="id"
				headerTitle={t.title}
				search={{
					labelWidth: 'auto',
				}}
				pagination={{
					defaultPageSize: 10,
					locale: antdLocale.Pagination,
				}}
				toolBarRender={() => [
					<Button key="add" type="primary" onClick={handleAdd}>
						<i className="ri-add-line mr-1" />
						{t.addEmployee}
					</Button>,
				]}
			/>

			<DrawerForm
				title={editingEmployee ? t.modal.editTitle : t.modal.addTitle}
				open={drawerVisible}
				onOpenChange={setDrawerVisible}
				onFinish={handleSubmit}
				initialValues={editingEmployee || {}}
				layout="vertical"
				drawerProps={{
					destroyOnClose: true,
				}}
				submitter={{
					searchConfig: {
						submitText: t.buttons.submit,
						resetText: t.buttons.cancel,
					},
					resetButtonProps: {
						onClick: () => setDrawerVisible(false),
					},
				}}
			>
				<ProFormText
					name="name"
					label={t.form.name}
					rules={[{ required: true, message: t.form.nameRequired }]}
					placeholder={t.form.nameRequired}
				/>
				<ProFormSelect
					name="department"
					label={t.form.department}
					rules={[{ required: true, message: t.form.departmentRequired }]}
					options={[
						{ label: t.departments.tech, value: 'tech' },
						{ label: t.departments.product, value: 'product' },
						{ label: t.departments.marketing, value: 'marketing' },
						{ label: t.departments.sales, value: 'sales' },
						{ label: t.departments.hr, value: 'hr' },
						{ label: t.departments.finance, value: 'finance' },
					]}
					placeholder={t.form.departmentRequired}
				/>
				<ProFormSelect
					name="position"
					label={t.form.position}
					rules={[{ required: true, message: t.form.positionRequired }]}
					options={[
						{ label: t.positions.junior, value: 'junior' },
						{ label: t.positions.intermediate, value: 'intermediate' },
						{ label: t.positions.senior, value: 'senior' },
						{ label: t.positions.expert, value: 'expert' },
						{ label: t.positions.manager, value: 'manager' },
						{ label: t.positions.director, value: 'director' },
					]}
					placeholder={t.form.positionRequired}
				/>
				<ProFormText
					name="email"
					label={t.form.email}
					rules={[
						{ required: true, message: t.form.emailRequired },
						{ type: 'email', message: t.form.emailInvalid },
					]}
					placeholder={t.form.emailRequired}
				/>
				<ProFormSelect
					name="status"
					label={t.form.status}
					rules={[{ required: true, message: t.form.statusRequired }]}
					options={[
						{ label: t.status.active, value: 'active' },
						{ label: t.status.inactive, value: 'inactive' },
						{ label: t.status.leave, value: 'leave' },
					]}
					placeholder={t.form.statusRequired}
				/>
				<ProFormDatePicker
					name="joinDate"
					label={t.form.joinDate}
					rules={[{ required: true, message: t.form.joinDateRequired }]}
					fieldProps={{
						locale: datePickerLocale,
						style: { width: '100%' },
					}}
					placeholder={t.form.joinDateRequired}
				/>
			</DrawerForm>
		</>
	);
}

export default ExamplesQueryTable;
