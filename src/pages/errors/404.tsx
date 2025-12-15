import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getErrorsLocale } from '@/locales';
import { useSystemStore } from '@/store';

function NotFound() {
	const navigate = useNavigate();
	const { locale } = useSystemStore();
	const t = getErrorsLocale(locale);

	return (
		<div className="flex h-full items-center justify-center">
			<Result
				status="404"
				title={t.notFound.title}
				subTitle={t.notFound.subTitle}
				extra={
					<div className="space-y-4">
						<div className="flex justify-center gap-3">
							<Button type="primary" onClick={() => navigate(-1)}>
								<i className="ri-arrow-left-line mr-2" />
								{t.buttons.goBack}
							</Button>
							<Button onClick={() => navigate('/dashboard')}>
								<i className="ri-home-line mr-2" />
								{t.buttons.goHome}
							</Button>
						</div>
					</div>
				}
			/>
		</div>
	);
}

export default NotFound;
