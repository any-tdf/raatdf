import { Button, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { getDocsUrl } from '@/config/docs';
import { getCommonLocale } from '@/locales';
import { useSystemStore } from '@/store';

const DOCS_LOAD_TIMEOUT = 10_000;

type LoadStatus = 'loading' | 'ready' | 'error';

interface DocsProps {
	docsUrl?: string;
}

const Docs = ({ docsUrl = getDocsUrl() }: DocsProps) => {
	const locale = useSystemStore((state) => state.locale);
	const t = getCommonLocale(locale).docs;
	const [status, setStatus] = useState<LoadStatus>('loading');
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		if (status !== 'loading') return;
		const timer = window.setTimeout(() => setStatus('error'), DOCS_LOAD_TIMEOUT);
		return () => window.clearTimeout(timer);
	}, [reloadKey, status]);

	const retry = () => {
		setStatus('loading');
		setReloadKey((current) => current + 1);
	};

	return (
		<div className="docs-page relative flex h-full min-h-0 w-full flex-col overflow-hidden">
			<div className="absolute top-3 right-3 z-10">
				<Button href={docsUrl} target="_blank" rel="noreferrer" icon={<i className="ri-external-link-line" />}>
					{t.openExternal}
				</Button>
			</div>

			{status === 'loading' && (
				<div className="absolute inset-0 z-5 flex items-center justify-center">
					<Spin size="large" description={t.loading} />
				</div>
			)}

			{status === 'error' && (
				<div className="absolute inset-0 z-5 flex items-center justify-center">
					<Result
						status="warning"
						title={t.timeoutTitle}
						subTitle={t.timeoutDescription}
						extra={[
							<Button key="retry" type="primary" onClick={retry}>
								{t.retry}
							</Button>,
							<Button key="external" href={docsUrl} target="_blank" rel="noreferrer">
								{t.openExternal}
							</Button>,
						]}
					/>
				</div>
			)}

			<iframe
				key={reloadKey}
				src={docsUrl}
				title={t.iframeTitle}
				className="min-h-0 w-full flex-1 border-0"
				style={{ opacity: status === 'ready' ? 1 : 0 }}
				onLoad={() => setStatus('ready')}
			/>
		</div>
	);
};

export default Docs;
