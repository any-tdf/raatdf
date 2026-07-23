import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearAuthentication } from '@/services/auth-service';
import { UNAUTHORIZED_EVENT } from '@/utils/auth-session';

const SessionEvents = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleUnauthorized = () => {
			clearAuthentication();
			void navigate('/login?reason=expired', { replace: true });
		};

		window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
		return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
	}, [navigate]);

	return null;
};

export default SessionEvents;
