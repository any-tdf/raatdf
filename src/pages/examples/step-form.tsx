import {
	ProFormDateRangePicker,
	ProFormDigit,
	ProFormSelect,
	ProFormText,
	StepsForm,
} from '@ant-design/pro-components';
import { App, Card } from 'antd';
import { getDatePickerLocale, getStepFormLocale } from '@/locales';
import { useSystemStore } from '@/store';

function ExamplesStepForm() {
	const { locale } = useSystemStore();
	const t = getStepFormLocale(locale);
	const { message } = App.useApp();

	// 获取当前语言的 DatePicker locale
	const datePickerLocale = getDatePickerLocale(locale);

	return (
		<Card title={t.title}>
			<StepsForm
				onFinish={async (values) => {
					console.log('所有步骤的数据：', values);
					message.success(t.message);
					return true;
				}}
			>
				<StepsForm.StepForm name="basic" title={t.steps.basic}>
					<ProFormText
						name="projectName"
						label={t.form.projectName}
						rules={[{ required: true, message: t.form.projectNameRequired }]}
					/>
					<ProFormSelect
						name="projectType"
						label={t.form.projectType}
						options={[
							{ label: t.options.typeA, value: 'A' },
							{ label: t.options.typeB, value: 'B' },
						]}
						rules={[{ required: true, message: t.form.projectTypeRequired }]}
					/>
					<ProFormDateRangePicker
						name="duration"
						label={t.form.duration}
						rules={[{ required: true, message: t.form.durationRequired }]}
						fieldProps={{
							locale: datePickerLocale,
						}}
					/>
				</StepsForm.StepForm>

				<StepsForm.StepForm name="team" title={t.steps.team}>
					<ProFormSelect
						name="leader"
						label={t.form.leader}
						options={[
							{ label: t.options.zhangsan, value: 'zhangsan' },
							{ label: t.options.lisi, value: 'lisi' },
						]}
						rules={[{ required: true, message: t.form.leaderRequired }]}
					/>
					<ProFormDigit
						name="budget"
						label={t.form.budget}
						rules={[{ required: true, message: t.form.budgetRequired }]}
						min={0}
					/>
				</StepsForm.StepForm>

				<StepsForm.StepForm name="confirm" title={t.steps.confirm}>
					<div style={{ padding: '20px', textAlign: 'center' }}>
						<p>{t.confirmText}</p>
					</div>
				</StepsForm.StepForm>
			</StepsForm>
		</Card>
	);
}

export default ExamplesStepForm;
