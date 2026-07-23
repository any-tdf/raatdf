export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_LOGIN_TIME_KEY = 'login_time';
export const LAST_USERNAME_KEY = 'last_username';
export const UNAUTHORIZED_EVENT = 'raatdf:unauthorized';

type AuthStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const getStorages = (): AuthStorage[] => {
	if (typeof window === 'undefined') {
		return [];
	}

	return [window.sessionStorage, window.localStorage];
};

export const getAuthToken = (): string | null => {
	for (const storage of getStorages()) {
		const token = storage.getItem(AUTH_TOKEN_KEY);
		if (token) {
			return token;
		}
	}

	return null;
};

export const saveAuthSession = (token: string, username: string, rememberMe: boolean): void => {
	if (typeof window === 'undefined') {
		return;
	}

	clearAuthSession();
	const storage = rememberMe ? window.localStorage : window.sessionStorage;
	storage.setItem(AUTH_TOKEN_KEY, token);
	storage.setItem(AUTH_LOGIN_TIME_KEY, Date.now().toString());

	if (rememberMe) {
		window.localStorage.setItem(LAST_USERNAME_KEY, username);
	} else {
		window.localStorage.removeItem(LAST_USERNAME_KEY);
	}
};

export const clearAuthSession = (): void => {
	if (typeof window === 'undefined') {
		return;
	}

	for (const storage of getStorages()) {
		storage.removeItem(AUTH_TOKEN_KEY);
		storage.removeItem(AUTH_LOGIN_TIME_KEY);
	}
};

export const dispatchUnauthorized = (): void => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
	}
};
