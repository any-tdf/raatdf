import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Forbidden from '@/pages/errors/403';
import { canAccessPage } from '@/utils/permissions';

interface ProtectedRouteProps {
	children: React.ReactNode;
	path?: string;
}

function ProtectedRoute({ children, path }: ProtectedRouteProps) {
	const location = useLocation();
	const [isChecking, setIsChecking] = useState(true);
	const [hasAccess, setHasAccess] = useState(false);

	useEffect(() => {
		const checkAccess = () => {
			const targetPath = path || location.pathname;

			// 检查页面访问权限
			const canAccess = canAccessPage(targetPath);
			setHasAccess(canAccess);
			setIsChecking(false);
		};

		checkAccess();
	}, [location.pathname, path]);

	// 权限检查中
	if (isChecking) {
		return (
			<div
				className="flex min-h-screen items-center justify-center"
				style={{ backgroundColor: 'var(--ant-color-bg-container)' }}
			>
				<div>检查权限中...</div>
			</div>
		);
	}

	// 无权限访问
	if (!hasAccess) {
		return <Forbidden />;
	}

	// 有权限，渲染子组件
	return <>{children}</>;
}

export default ProtectedRoute;
