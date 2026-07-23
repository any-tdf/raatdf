import { Spin } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';

import { useMenuStore, useUserStore } from '@/store';
import { canAccessPage } from '@/utils/permissions';

interface ProtectedRouteProps {
	children: React.ReactNode;
	path?: string;
}

const ProtectedRoute = ({ children, path }: ProtectedRouteProps) => {
	const location = useLocation();
	const authStatus = useUserStore((state) => state.authStatus);
	const isMenuReady = useMenuStore((state) => state.isReady);

	if (authStatus === 'initializing' || (authStatus === 'authenticated' && !isMenuReady)) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spin size="large" description="正在加载权限信息" />
			</div>
		);
	}

	if (authStatus !== 'authenticated') {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (!canAccessPage(path ?? location.pathname)) {
		return <Navigate to="/403" replace />;
	}

	return children;
};

export default ProtectedRoute;
