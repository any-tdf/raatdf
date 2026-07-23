export const LOCAL_DOCS_URL = 'http://localhost:4321';
export const DEFAULT_PRODUCTION_DOCS_URL = 'https://doc.raatdf.com';

type DocsEnvironment = Pick<ImportMetaEnv, 'DEV' | 'VITE_DOCS_URL'>;

export const resolveDocsUrl = ({ DEV, VITE_DOCS_URL }: DocsEnvironment): string => {
	if (DEV) return LOCAL_DOCS_URL;
	return VITE_DOCS_URL ?? DEFAULT_PRODUCTION_DOCS_URL;
};

export const getDocsUrl = (): string => resolveDocsUrl(import.meta.env);
