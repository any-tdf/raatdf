import { App, Button, Checkbox, Form, Input, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuData, type MenuItem } from '@/api/mocks/menu';
import { userApi } from '@/api/modules/user';
import { Logo } from '@/components/system';
import { CONFIG_OPTIONS } from '@/config/system';
import { getAuthLocale, getCommonLocale, SUPPORTED_LOCALES } from '@/locales';
import { ThemeMode, useSystemStore, useUserStore } from '@/store';

interface LoginFormData {
	username: string;
	password: string;
	remember?: boolean;
}

// Orbiting Circles 配置 - 简化为两个圈
const ORBIT_CONFIG = {
	// 中心配置
	center: {
		size: 80, // 中心元素大小
	},
	// 两个轨道配置
	orbits: [
		{ radius: 120, speed: '25s', delay: '0s' }, // 内圈
		{ radius: 200, speed: '40s', delay: '-10s' }, // 外圈
	],
};

// 技术栈数据 - 随机分配到两个圈上
const TECH_STACK = [
	{
		name: 'React',
		logo: '/logo/react.svg',
		color: '#61dafb',
		size: 1,
	},
	{
		name: 'TypeScript',
		logo: '/logo/ts.svg',
		color: '#3178c6',
		size: 0.8,
	},
	{
		name: 'Vite',
		logo: '/logo/vite.svg',
		color: '#646cff',
		size: 1,
	},
	{
		name: 'Ant Design',
		logo: '/logo/antd.svg',
		color: '#1890ff',
		size: 1,
	},
	{
		name: 'Tailwind CSS',
		logo: '/logo/tailwind.svg',
		color: '#06b6d4',
		size: 1,
	},
	{
		name: 'Biome',
		logo: '/logo/biome.svg',
		color: '#60a5fa',
		size: 1,
	},
	{
		name: 'RemixIcon',
		logo: '/logo/remixicon.svg',
		color: '#8b5cf6',
		size: 0.8,
	},
	{
		name: 'Zustand',
		logo: '/logo/zustand.svg',
		color: '#f59e0b',
		size: 1,
	},
	{
		name: 'Axios',
		logo: '/logo/axios.svg',
		color: '#5a29e4',
		size: 1.6,
	},
];

// 主题颜色类型
interface ThemeColors {
	primary: string;
	primaryHover: string;
	primaryActive: string;
}

// Orbiting Circles 组件 - 同心圆围绕系统 logo
const OrbitingCircles = ({ themeColors }: { themeColors: ThemeColors }) => {
	// 随机分配技术栈到两个圈
	const shuffledTechs = [...TECH_STACK].sort(() => Math.random() - 0.5);
	const innerOrbitTechs = shuffledTechs.slice(0, 5); // 内圈 5 个
	const outerOrbitTechs = shuffledTechs.slice(5, 9); // 外圈 4 个

	// 轨道半径
	const innerRadius = 120;
	const outerRadius = 200;

	return (
		<div className="relative flex items-center justify-center" style={{ width: '500px', height: '500px' }}>
			{/* 外圈圆环 - 最底层，动画已包含 translate(-50%, -50%) 居中 */}
			<div
				className="absolute rounded-full border-2 border-dashed"
				style={{
					width: `${outerRadius * 2}px`,
					height: `${outerRadius * 2}px`,
					top: '50%',
					left: '50%',
					borderColor: `${themeColors.primaryHover}22`,
					boxShadow: `0 0 20px ${themeColors.primaryHover}11`,
					animation: 'orbit-rotate 40s linear infinite reverse',
				}}
			/>

			{/* 内圈圆环 - 中间层，动画已包含 translate(-50%, -50%) 居中 */}
			<div
				className="absolute rounded-full border-2 border-dashed"
				style={{
					width: `${innerRadius * 2}px`,
					height: `${innerRadius * 2}px`,
					top: '50%',
					left: '50%',
					borderColor: `${themeColors.primary}22`,
					boxShadow: `0 0 20px ${themeColors.primary}11`,
					animation: 'orbit-rotate 25s linear infinite',
				}}
			/>

			{/* 外圈技术 logo */}
			{outerOrbitTechs.map((tech, index) => {
				const angle = index * 90; // 外圈 4 个，每个 90 度
				return (
					<div
						key={`outer-${tech.name}`}
						className="absolute flex items-center justify-center"
						style={
							{
								width: `${48 * tech.size}px`,
								height: `${48 * tech.size}px`,
								animation: 'orbit-logo-up-reverse 40s linear infinite',
								'--orbit-radius': `${outerRadius}px`,
								'--orbit-duration': '40s',
								'--orbit-angle': `${angle}deg`,
								left: '50%',
								top: '50%',
							} as React.CSSProperties
						}
					>
						<img
							src={tech.logo}
							alt={tech.name}
							className="object-contain"
							style={{
								width: `${40 * tech.size}px`,
								height: `${40 * tech.size}px`,
								filter: tech.name === 'RemixIcon' ? 'contrast(1.2) brightness(1.1)' : 'none',
							}}
						/>
					</div>
				);
			})}

			{/* 内圈技术 logo */}
			{innerOrbitTechs.map((tech, index) => {
				const angle = index * 72; // 内圈 5 个，每个 72 度
				return (
					<div
						key={`inner-${tech.name}`}
						className="absolute flex items-center justify-center"
						style={
							{
								width: `${48 * tech.size}px`,
								height: `${48 * tech.size}px`,
								animation: 'orbit-logo-up 25s linear infinite',
								'--orbit-radius': `${innerRadius}px`,
								'--orbit-duration': '25s',
								'--orbit-angle': `${angle}deg`,
								left: '50%',
								top: '50%',
							} as React.CSSProperties
						}
					>
						<img
							src={tech.logo}
							alt={tech.name}
							className="object-contain"
							style={{
								width: `${40 * tech.size}px`,
								height: `${40 * tech.size}px`,
								filter: tech.name === 'RemixIcon' ? 'contrast(1.2) brightness(1.1)' : 'none',
							}}
						/>
					</div>
				);
			})}

			{/* 系统 Logo - 中心，最顶层 */}
			<div
				className="relative z-20 flex items-center justify-center"
				style={{
					width: `${ORBIT_CONFIG.center.size}px`,
					height: `${ORBIT_CONFIG.center.size}px`,
				}}
			>
				<Logo size={40} color={themeColors.primary} />
			</div>
		</div>
	);
};

function Auth() {
	const location = useLocation();
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const { themeMode, toggleTheme, primaryColor, setPrimaryColor, locale, setLocale, isDark, setMenuData } =
		useSystemStore();
	const { setUserInfo } = useUserStore();
	const { message } = App.useApp();

	// 获取当前语言的配置选项和多语言文本
	const configOptions = CONFIG_OPTIONS(locale);
	const t = getAuthLocale(locale);
	const commonLocale = getCommonLocale(locale);

	// 表单实例
	const [loginForm] = Form.useForm();
	const [loading, setLoading] = useState(false);

	// 登录表单默认值
	const loginDefaultValues = useMemo(
		() => ({
			username: 'admin',
			password: '123456',
			remember: true,
		}),
		[]
	);

	// 获取主题图标
	const getThemeIcon = () => {
		switch (themeMode) {
			case ThemeMode.DARK:
				return 'ri-moon-line';
			case ThemeMode.LIGHT:
				return 'ri-sun-line';
			case ThemeMode.SYSTEM:
				return 'ri-computer-line';
			default:
				return 'ri-computer-line';
		}
	};

	// 调整颜色亮度的辅助函数
	const adjustColor = (color: string, amount: number): string => {
		// 将 hex 转换为 rgb
		const num = Number.parseInt(color.replace('#', ''), 16);
		const r = Math.max(0, Math.min(255, (num >> 16) + amount));
		const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
		const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	};

	// 使用动态主题色
	const colors = {
		primary: primaryColor,
		primaryHover: adjustColor(primaryColor, 15), // 更亮一点
		primaryActive: adjustColor(primaryColor, -5), // 更暗一点
	};

	// 检查当前主题色是否为预设颜色
	const getCurrentPresetTheme = () => {
		return configOptions.theme.presetColors.find((color) => color.value.toLowerCase() === primaryColor.toLowerCase());
	};

	// 根据当前路径设置默认页面
	useEffect(() => {
		if (location.pathname === '/register') {
			setIsLogin(false);
		} else {
			setIsLogin(true);
		}
	}, [location.pathname]);

	// 初始化登录表单默认值
	useEffect(() => {
		loginForm.setFieldsValue(loginDefaultValues);
	}, [loginForm, loginDefaultValues]);

	// 登录表单提交
	const onLoginFinish = async (values: LoginFormData) => {
		setLoading(true);

		// 调用登录 API
		const loginResponse = await userApi.login({
			username: values.username,
			password: values.password,
		});

		if (!loginResponse.success || !loginResponse.data) {
			message.error(t.login.loginFailed);
			setLoading(false);
			return;
		}

		const { accessToken } = loginResponse.data;

		// 存储 token
		localStorage.setItem('auth_token', accessToken);
		localStorage.setItem('login_time', Date.now().toString());
		localStorage.setItem('last_username', values.username);

		// 获取用户信息
		const profileResponse = await userApi.getProfile(accessToken);
		if (!profileResponse.success || !profileResponse.data) {
			message.error(t.login.loginFailed);
			setLoading(false);
			return;
		}

		const user = profileResponse.data;

		// 保存用户信息到 Zustand store
		setUserInfo({
			username: user.username,
			email: user.email || '',
			role: user.role as 'admin' | 'user',
			avatar: user.avatar,
		});

		// 获取菜单数据
		const menuResponse = await userApi.getMenu(accessToken);
		if (menuResponse.success && menuResponse.data) {
			setMenuData(menuResponse.data);
			const firstPath = getFirstMenuPath(menuResponse.data);
			message.success(t.login.loginSuccess);
			navigate(firstPath);
		} else {
			// 获取菜单失败时使用默认菜单
			const fallbackMenu = getMenuData(locale, user.role as 'admin' | 'user');
			setMenuData(fallbackMenu);
			const firstPath = getFirstMenuPath(fallbackMenu);
			message.success(t.login.loginSuccess);
			navigate(firstPath);
		}

		setLoading(false);
	};

	/**
	 * 获取菜单中第一个有效路径
	 * 递归查找第一个有 path 属性的菜单项
	 */
	const getFirstMenuPath = (items: MenuItem[]): string => {
		for (const item of items) {
			if (item.path) {
				return item.path;
			}
			if (item.children && item.children.length > 0) {
				const childPath = getFirstMenuPath(item.children);
				if (childPath) {
					return childPath;
				}
			}
		}
		return '/dashboard'; // 兜底默认路径
	};

	// 注册表单提交（仅用于展示）
	const onRegisterFinish = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		message.info('演示版本，暂不支持注册功能');
		setLoading(false);
	};

	const toggleAuthMode = () => {
		if (isLogin) {
			setIsLogin(false);
			navigate('/register');
		} else {
			setIsLogin(true);
			navigate('/login');
		}
	};

	// 装饰参数
	const displayTitle = commonLocale.system.name;
	const displaySubtitle = isLogin ? commonLocale.system.tagline : t.register.tagline;

	return (
		<>
			{/* 认证页面专用的轨道动画样式 */}
			<style>{`
				@keyframes orbit-rotate {
					0% {
						transform: translate(-50%, -50%) rotate(0deg);
					}
					100% {
						transform: translate(-50%, -50%) rotate(360deg);
					}
				}

				@keyframes orbit-logo-up {
					0% {
						transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) + 0deg)) translateX(var(--orbit-radius))
							rotate(calc(var(--orbit-angle) * -1));
					}
					100% {
						transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) + 360deg)) translateX(var(--orbit-radius))
							rotate(calc((var(--orbit-angle) + 360deg) * -1));
					}
				}

				@keyframes orbit-logo-up-reverse {
					0% {
						transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) + 0deg)) translateX(var(--orbit-radius))
							rotate(calc(var(--orbit-angle) * -1));
					}
					100% {
						transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) - 360deg)) translateX(var(--orbit-radius))
							rotate(calc((var(--orbit-angle) - 360deg) * -1));
					}
				}
			`}</style>

			<div className="relative flex min-h-screen" style={{ backgroundColor: 'var(--ant-color-bg-container)' }}>
				{/* 右上角工具栏 */}
				<div className="absolute top-6 right-6 z-50 flex items-center gap-2">
					{/* 主题色选择器 */}
					<Button
						type="text"
						className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-transparent"
						style={{
							border: 'none',
							padding: 0,
							backgroundColor: 'transparent',
						}}
					>
						{/* 主题图标 - 默认显示 */}
						<i className="ri-palette-line text-lg" style={{ color: 'var(--ant-color-text-primary)' }} />

						{/* 颜色选择球 - hover 时展开 */}
						<div
							className="-translate-y-1/2 invisible absolute top-1/2 right-full mr-2 flex origin-[right_center] translate-x-4 transform items-center gap-1 rounded-full p-2 opacity-0 shadow-md transition-all duration-300 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
							style={{
								backgroundColor: 'transparent',
								boxShadow: isDark ? '0 2px 8px rgba(255, 255, 255, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.15)',
							}}
						>
							{configOptions.theme.presetColors.map((color, index) => (
								<button
									type="button"
									key={color.value}
									className="relative h-6 w-6 origin-center scale-50 cursor-pointer rounded-full border-0 p-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
									style={{
										backgroundColor: color.value,
										opacity: getCurrentPresetTheme()?.value === color.value ? 1 : 0.8,
										transitionDelay: `${index * 30}ms`,
									}}
									onClick={(e) => {
										e?.stopPropagation?.();
										setPrimaryColor(color.value);
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.opacity = '1';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.opacity = getCurrentPresetTheme()?.value === color.value ? '1' : '0.8';
									}}
									title={color.label}
								>
									{getCurrentPresetTheme()?.value === color.value && (
										<i className="ri-check-line -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 font-black text-base text-white" />
									)}
								</button>
							))}
						</div>
					</Button>

					{/* 语言切换器 */}
					<Button
						type="text"
						className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-transparent"
						style={{
							border: 'none',
							padding: 0,
							backgroundColor: 'transparent',
						}}
					>
						{/* 多语言图标 */}
						<i className="ri-translate-2 text-lg" style={{ color: 'var(--ant-color-text-primary)' }} />

						{/* 语言选择 - hover 时向下展开 */}
						<div
							className="-translate-y-2 invisible absolute top-full right-0 mt-2 flex origin-top transform flex-col gap-1 rounded-lg p-2 opacity-0 shadow-md transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
							style={{
								backgroundColor: 'var(--ant-color-bg-elevated)',
								boxShadow: isDark ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
								minWidth: '120px',
							}}
						>
							{SUPPORTED_LOCALES.map((lang, index) => (
								<button
									type="button"
									key={lang.value}
									className="relative flex w-full origin-center scale-90 cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-3 py-1.5 text-left opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
									style={{
										backgroundColor: locale === lang.value ? 'var(--ant-color-primary-bg)' : 'transparent',
										transitionDelay: `${index * 50}ms`,
									}}
									onClick={(e) => {
										e?.stopPropagation?.();
										setLocale(lang.value);
									}}
									onMouseEnter={(e) => {
										if (locale !== lang.value) {
											e.currentTarget.style.backgroundColor = 'var(--ant-color-bg-text-hover)';
										}
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor =
											locale === lang.value ? 'var(--ant-color-primary-bg)' : 'transparent';
									}}
								>
									<span className="text-sm">{lang.flag}</span>
									<span
										className="whitespace-nowrap text-sm"
										style={{
											color: locale === lang.value ? 'var(--ant-color-primary)' : 'var(--ant-color-text)',
										}}
									>
										{lang.label}
									</span>
									{locale === lang.value && (
										<i className="ri-check-line ml-auto text-sm" style={{ color: 'var(--ant-color-primary)' }} />
									)}
								</button>
							))}
						</div>
					</Button>

					{/* 深浅模式切换 */}
					<Button
						type="text"
						icon={<i className={`${getThemeIcon()} text-lg`} />}
						onClick={toggleTheme}
						className="hover:bg-transparent"
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '40px',
							height: '40px',
							borderRadius: '8px',
							transition: 'all 0.3s ease',
							backgroundColor: 'transparent',
						}}
					/>
				</div>

				{/* 左侧装饰区域 */}
				<div
					className="relative hidden overflow-hidden transition-all duration-500 lg:flex lg:w-3/5"
					style={{
						backgroundColor: 'var(--ant-color-bg-container)',
					}}
				>
					{/* 左侧内容 */}
					<div
						className="relative z-10 flex h-full w-full flex-col items-center justify-center px-12 text-center"
						style={{ color: 'var(--ant-color-text)' }}
					>
						{/* Logo */}
						<div className="mb-16">
							<div className="mb-12 flex items-center justify-center space-x-4">
								<div
									className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-300"
									style={{
										background: 'var(--ant-color-bg-elevated)',
									}}
								>
									{isLogin ? (
										<Logo size={30} color={colors.primary} />
									) : (
										<i className="ri-user-add-line text-3xl" style={{ color: colors.primary }} />
									)}
								</div>
								<Typography.Title level={1} className="font-bold" style={{ fontSize: '36px', margin: 0 }}>
									{displayTitle}
								</Typography.Title>
							</div>
							<Typography.Text className="mx-auto max-w-md text-center" style={{ fontSize: '20px' }}>
								{displaySubtitle}
							</Typography.Text>
						</div>

						{/* Orbiting Circles 装饰图案 */}
						<div className="relative flex items-center justify-center">
							<OrbitingCircles themeColors={colors} />
						</div>

						{/* 底部版权信息 */}
						<div
							className="mt-12 text-center"
							style={{ fontSize: '12px', opacity: 0.65, color: 'var(--ant-color-text)' }}
						>
							<Typography.Text>
								<a
									href="https://github.com/any-tdf"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: 'var(--ant-color-primary)', textDecoration: 'none' }}
								>
									{commonLocale.system.copyright}
								</a>
								<span style={{ margin: '0 8px' }}>·</span>
								<span>v{__APP_VERSION__}</span>
							</Typography.Text>
						</div>
					</div>
				</div>

				{/* 右侧内容区域 */}
				<div
					className="flex flex-1 items-center justify-center p-8 lg:w-2/5"
					style={{ color: 'var(--ant-color-text)' }}
				>
					<div className="w-full max-w-sm">
						{isLogin ? (
							<>
								{/* 登录标题 */}
								<div className="mb-8">
									<Typography.Title level={2} className="mb-2">
										{t.login.title}
									</Typography.Title>
									<Typography.Text style={{ fontSize: '14px' }}>{t.login.subtitle}</Typography.Text>
								</div>

								{/* 登录表单 */}
								<Form form={loginForm} name="login" onFinish={onLoginFinish} layout="vertical" size="large">
									<Form.Item name="username" rules={[{ required: true, message: t.login.usernameRequired }]}>
										<Input prefix={<i className="ri-user-3-line" />} placeholder={t.login.usernamePlaceholder} />
									</Form.Item>

									<Form.Item name="password" rules={[{ required: true, message: t.login.passwordRequired }]}>
										<Input.Password
											prefix={<i className="ri-lock-2-line" />}
											placeholder={t.login.passwordPlaceholder}
										/>
									</Form.Item>

									<Form.Item>
										<div className="flex items-center justify-between">
											<Form.Item name="remember" valuePropName="checked" noStyle>
												<Checkbox>{t.login.rememberMe}</Checkbox>
											</Form.Item>
											<Typography.Text className="cursor-pointer text-sm" style={{ fontSize: '14px' }}>
												{t.login.forgotPassword}
											</Typography.Text>
										</div>
									</Form.Item>

									<Form.Item>
										<Button type="primary" htmlType="submit" loading={loading} block className="h-10 rounded-lg">
											{loading ? t.login.loggingIn : t.login.loginButton}
										</Button>
									</Form.Item>
								</Form>

								{/* 测试账号提示 */}
								<div className="mt-6 text-center">
									<Typography.Text className="text-xs" style={{ fontSize: '12px' }}>
										{t.login.testAccount}
									</Typography.Text>
								</div>

								{/* 菜单权限提示 */}
								<div className="mt-3 text-center">
									<Typography.Text className="text-xs" style={{ fontSize: '12px', opacity: 0.7 }}>
										<i className="ri-lightbulb-flash-line mr-1" style={{ color: 'var(--ant-color-primary)' }} />
										{t.login.menuTip}
									</Typography.Text>
								</div>

								{/* 切换到注册 */}
								<div className="mt-8 text-center">
									<Typography.Text style={{ fontSize: '14px' }}>
										{t.login.noAccount}
										<Button
											type="link"
											onClick={toggleAuthMode}
											style={{
												color: 'var(--ant-color-primary)',
												fontSize: '14px',
												padding: '0',
												height: 'auto',
												marginLeft: '4px',
											}}
										>
											{t.login.registerNow}
										</Button>
									</Typography.Text>
								</div>
							</>
						) : (
							<>
								{/* 注册标题 */}
								<div className="mb-8">
									<Typography.Title level={2} className="mb-2">
										{t.register.title}
									</Typography.Title>
									<Typography.Text style={{ fontSize: '14px' }}>{t.register.subtitle}</Typography.Text>
								</div>

								{/* 注册表单 */}
								<Form name="register" onFinish={onRegisterFinish} layout="vertical" size="large">
									<Form.Item
										name="username"
										rules={[
											{ required: true, message: t.register.usernameRequired },
											{ min: 3, message: t.register.usernameMinLength },
											{ max: 20, message: t.register.usernameMaxLength },
										]}
									>
										<Input prefix={<i className="ri-user-3-line" />} placeholder={t.register.usernamePlaceholder} />
									</Form.Item>

									<Form.Item
										name="email"
										rules={[
											{ required: true, message: t.register.emailRequired },
											{ type: 'email', message: t.register.emailInvalid },
										]}
									>
										<Input prefix={<i className="ri-mail-line" />} placeholder={t.register.emailPlaceholder} />
									</Form.Item>

									<Form.Item
										name="password"
										rules={[
											{ required: true, message: t.register.passwordRequired },
											{ min: 6, message: t.register.passwordMinLength },
										]}
									>
										<Input.Password
											prefix={<i className="ri-lock-2-line" />}
											placeholder={t.register.passwordPlaceholder}
										/>
									</Form.Item>

									<Form.Item
										name="confirmPassword"
										dependencies={['password']}
										rules={[
											{ required: true, message: t.register.confirmPasswordRequired },
											({ getFieldValue }) => ({
												validator(_, value) {
													if (!value || getFieldValue('password') === value) {
														return Promise.resolve();
													}
													return Promise.reject(new Error(t.register.passwordMismatch));
												},
											}),
										]}
									>
										<Input.Password
											prefix={<i className="ri-lock-2-line" />}
											placeholder={t.register.confirmPasswordPlaceholder}
										/>
									</Form.Item>

									<Form.Item
										name="agree"
										valuePropName="checked"
										rules={[
											{
												validator: (_, value) =>
													value ? Promise.resolve() : Promise.reject(new Error(t.register.agreeRequired)),
											},
										]}
									>
										<Checkbox>
											<Typography.Text>{t.register.termsPrefix}</Typography.Text>
											<Typography.Text>{t.register.termsOfService}</Typography.Text>
											{t.register.and}
											<Typography.Text>{t.register.privacyPolicy}</Typography.Text>
										</Checkbox>
									</Form.Item>

									<Form.Item>
										<Button type="primary" htmlType="submit" loading={loading} block className="h-10 rounded-lg">
											{loading ? t.register.registering : t.register.registerButton}
										</Button>
									</Form.Item>
								</Form>

								{/* 切换到登录 */}
								<div className="mt-8 text-center">
									<Typography.Text style={{ fontSize: '14px' }}>
										{t.register.hasAccount}
										<Button
											type="link"
											onClick={toggleAuthMode}
											style={{
												color: 'var(--ant-color-primary)',
												fontSize: '14px',
												padding: '0',
												height: 'auto',
												marginLeft: '4px',
											}}
										>
											{t.register.loginNow}
										</Button>
									</Typography.Text>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default Auth;
