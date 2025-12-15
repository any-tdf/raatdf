import { Button, Result, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getErrorsLocale } from '@/locales';
import { useSystemStore } from '@/store';

const { Paragraph } = Typography;

function ServerError() {
	const navigate = useNavigate();
	const { locale } = useSystemStore();
	const t = getErrorsLocale(locale);

	return (
		<div className="flex h-full items-center justify-center">
			<Result
				status="500"
				title={t.serverError.title}
				subTitle={t.serverError.subTitle}
				extra={
					<div className="space-y-4">
						<Paragraph style={{ textAlign: 'center', color: 'var(--ant-color-text-secondary)' }}>
							{t.serverError.description}
						</Paragraph>
						<div className="flex justify-center gap-3">
							<Button type="primary" onClick={() => navigate(-1)}>
								<i className="ri-arrow-left-line mr-2" />
								{t.buttons.goBack}
							</Button>
							<Button onClick={() => navigate('/dashboard')}>
								<i className="ri-home-line mr-2" />
								{t.buttons.goHome}
							</Button>
							<Button onClick={() => window.location.reload()}>
								<i className="ri-refresh-line mr-2" />
								{t.buttons.refresh}
							</Button>
						</div>
					</div>
				}
			/>
		</div>
	);
}

export default ServerError;
