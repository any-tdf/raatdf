import { Button, Result } from 'antd';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error('应用渲染失败：', error, info.componentStack);
	}

	private handleReset = (): void => {
		this.setState({ hasError: false });
		window.location.hash = '#/dashboard';
	};

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<Result
					status="500"
					title="页面加载失败"
					subTitle="应用遇到了未处理的错误，请重试或返回首页。"
					extra={
						<Button type="primary" onClick={this.handleReset}>
							返回首页
						</Button>
					}
				/>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
