import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css'; // V6 零运行时模式需要的 CSS 重置
import 'antd/dist/antd.css'; // V6 零运行时模式需要的 CSS 文件
import './app.css';
import App from '@/app';

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>
	);
}
