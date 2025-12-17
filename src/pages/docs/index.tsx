import { Spin } from 'antd';
import { useState, useEffect, useRef } from 'react';

export default function Docs() {
	const [loading, setLoading] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateHeight = () => {
			if (!containerRef.current) return;

			// 向上查找记载 Content 的实际可用高度
			let current: HTMLElement | null = containerRef.current.parentElement;
			while (current && !current.classList.contains('ant-layout-content')) {
				current = current.parentElement;
			}

			if (current) {
				// Content 可用高度 = 元素高度 - 内边距
				const style = window.getComputedStyle(current);
				const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
				const availableHeight = current.clientHeight - paddingY;

				containerRef.current.style.height = `${availableHeight}px`;
			}
		};

		// 多次执行以适应各种布局变化
		const timers = [10, 50, 150].map(ms => setTimeout(updateHeight, ms));
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
			timers.forEach((t) => {
				clearTimeout(t);
			});
		};
	}, []);

	return (
		<div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
			{loading && (
				<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
					<Spin size="large" />
				</div>
			)}
			<iframe
				src="https://doc.raatdf.com"
				title="文档"
				style={{
					width: '100%',
					height: '100%',
					border: 'none',
					opacity: loading ? 0 : 1,
				}}
				onLoad={() => setLoading(false)}
			/>
		</div>
	);
}





