import type { MenuProps } from 'antd';
import { App, Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, Popover, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuItem } from '@/api/mocks/menu';
import { system } from '@/components';
import {
	buildAccountMenuItems,
	handleAccountMenuClick as handleAccountMenuItemClick,
} from '@/layouts/account-menu-items';
import type { HeaderIconButton } from '@/layouts/toolbar-buttons';
import { getButtonLabel, toolbarButtons } from '@/layouts/toolbar-buttons';
import { getCommonLocale } from '@/locales';
import { useMenuStore, useSystemSettingsDrawer, useSystemStore, useUserStore } from '@/store';
import type { Locale } from '@/store/types';
import { canAccessPage } from '@/utils/permissions';

// ==================== 工具栏按钮子组件 ====================

interface ToolbarButtonProps {
	item: HeaderIconButton;
	borderRadius: number;
	collapsed: boolean;
	locale: Locale;
	popoverStates: Record<string, boolean>;
	setPopoverStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

/** 工具栏按钮组件（支持折叠/展开两种模式） */
function ToolbarButton({ item, borderRadius, collapsed, locale, popoverStates, setPopoverStates }: ToolbarButtonProps) {
	const shouldShowDot = item.popover?.shouldShowDot ? item.popover.shouldShowDot() : item.dot;
	const label = item.labelKey ? getButtonLabel(item.labelKey, locale) : item.key;

	const button = collapsed ? (
		<Button
			type="text"
			onClick={item.popover ? undefined : item.onClick}
			style={{
				width: '40px',
				height: '40px',
				minWidth: '40px',
				minHeight: '40px',
				padding: 0,
				borderRadius: `${borderRadius}px`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}}
		>
			<span className="relative inline-block leading-none">
				<i className={`${item.icon} ${item.animation || ''}`} style={{ fontSize: '18px', display: 'inline-block' }} />
				{shouldShowDot && (
					<span
						className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full"
						style={{ backgroundColor: 'var(--ant-color-error)', transform: 'translate(50%, -50%)' }}
					/>
				)}
			</span>
		</Button>
	) : (
		<Button
			type="text"
			onClick={item.popover ? undefined : item.onClick}
			style={{
				width: '100%',
				height: '36px',
				padding: '0 12px',
				borderRadius: `${borderRadius}px`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				gap: '10px',
			}}
		>
			<span className="relative inline-block leading-none">
				<i className={`${item.icon} ${item.animation || ''}`} style={{ fontSize: '16px', display: 'inline-block' }} />
				{shouldShowDot && (
					<span
						className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full"
						style={{ backgroundColor: 'var(--ant-color-error)', transform: 'translate(50%, -50%)' }}
					/>
				)}
			</span>
			<span className="truncate text-sm">{label}</span>
		</Button>
	);

	if (item.popover) {
		return (
			<Popover
				content={item.popover.content({ onClose: () => setPopoverStates((prev) => ({ ...prev, [item.key]: false })) })}
				trigger={item.popover.trigger || 'click'}
				open={popoverStates[item.key] || false}
				onOpenChange={(open) => setPopoverStates((prev) => ({ ...prev, [item.key]: open }))}
				placement="right"
				arrow={item.popover.arrow ?? false}
			>
				{button}
			</Popover>
		);
	}

	return button;
}

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
	breadcrumbs?: Array<{ title: string; path?: string }>;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 主布局组件需要处理多种布局模式、主题设置和状态管理
function AppLayout({ breadcrumbs }: AppLayoutProps) {
	// 从 Ant Design App 组件获取 modal 和 message 实例（支持深色模式）
	const { modal, message } = App.useApp();
	// 从 menu store 获取动态菜单数据（会随语言变化）
	const { menuData } = useMenuStore();
	const {
		locale,
		contentWidth,
		menuLayout,
		isFloatingUI,
		borderRadius,
		showRefreshButton,
		showCollapseButton,
		menuCollapsed,
		setMenuCollapsed,
		showHeaderButtons,
		showTabs,
		isImmersiveMode,
		setImmersiveMode,
		showContentBackground,
		addTab,
		fixedWidthMax,
		clearAllTabsAndCache,
		sidebarToolbar,
	} = useSystemStore();
	const { userInfo, clearUserInfo } = useUserStore();
	const { loadMenuData } = useMenuStore();
	const { open, showDrawer, hideDrawer } = useSystemSettingsDrawer();
	const navigate = useNavigate();
	const location = useLocation();

	// 管理所有 Popover 的打开状态
	const [popoverStates, setPopoverStates] = useState<Record<string, boolean>>({});

	// 菜单折叠状态的 localStorage key
	const MENU_COLLAPSED_KEY = 'ant_admin_menu_collapsed';

	// 获取当前路径应该展开的父级菜单键
	const getParentKeys = useCallback((items: MenuItem[], targetPath: string, currentPath: string[] = []): string[] => {
		for (const item of items) {
			const currentPathWithItem = [...currentPath, item.key];

			// 检查当前项或其子项是否匹配路径
			if (item.path === targetPath) {
				// 返回除当前项外的所有父级键
				return currentPath;
			}

			// 检查子项是否匹配路径
			if (item.children && item.children.length > 0) {
				const found = getParentKeys(item.children, targetPath, currentPathWithItem);
				if (found.length > 0) {
					return found;
				}
			}
		}
		return [];
	}, []);

	// 递归查找菜单项的辅助函数
	const findMenuItemByPath = useCallback((items: MenuItem[], path: string): string | null => {
		for (const item of items) {
			if (item.path === path) {
				return item.key;
			}
			if (item.children && item.children.length > 0) {
				const found = findMenuItemByPath(item.children, path);
				if (found) return found;
			}
		}
		return null;
	}, []);

	// 递归查找菜单项的辅助函数（返回完整对象）
	const findMenuItemObjectByPath = useCallback((items: MenuItem[], path: string): MenuItem | null => {
		for (const item of items) {
			if (item.path === path) {
				return item;
			}
			if (item.children && item.children.length > 0) {
				const found = findMenuItemObjectByPath(item.children, path);
				if (found) return found;
			}
		}
		return null;
	}, []);

	// 获取当前选中的顶级菜单
	const getCurrentTopMenu = useCallback((): string => {
		const path = location.pathname;

		// 查找当前路径对应的菜单项及其父级
		// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 需要递归查找菜单树中的目标路径及其父级菜单
		const findTopLevelMenu = (items: MenuItem[], targetPath: string): string => {
			for (const item of items) {
				// 检查当前项或其子项是否匹配路径
				if (item.path === targetPath) {
					return item.key;
				}

				// 检查子项是否匹配路径
				if (item.children && item.children.length > 0) {
					const found = findMenuItemByPath(item.children, targetPath);
					if (found) {
						return item.key;
					}
				}

				// 检查路径是否以当前项的路径开头
				if (item.path && targetPath.startsWith(item.path)) {
					return item.key;
				}
			}
			return 'dashboard'; // 默认返回 dashboard
		};

		return findTopLevelMenu(menuData, path);
	}, [location.pathname, findMenuItemByPath, menuData]);

	const [localCollapsed, setLocalCollapsed] = useState(() => {
		// 从 localStorage 读取菜单折叠状态
		const savedCollapsed = localStorage.getItem(MENU_COLLAPSED_KEY);
		return savedCollapsed !== null ? JSON.parse(savedCollapsed) : false;
	});
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	// 根据是否显示折叠按钮来决定使用哪个状态
	const collapsed = showCollapseButton ? localCollapsed : menuCollapsed;
	const setCollapsed = showCollapseButton ? setLocalCollapsed : setMenuCollapsed;

	// 混合布局中当前选中的顶级菜单
	const [mixedLayoutSelectedTopMenu, setMixedLayoutSelectedTopMenu] = useState<string>(() => {
		return 'dashboard'; // 初始值设为 dashboard，稍后会在 useEffect 中更新
	});

	// 保存菜单折叠状态（仅在显示折叠按钮时保存到 localStorage）
	useEffect(() => {
		if (showCollapseButton) {
			localStorage.setItem(MENU_COLLAPSED_KEY, JSON.stringify(localCollapsed));
		}
	}, [localCollapsed, showCollapseButton]);

	// 监听语言变化，加载对应语言的菜单数据
	useEffect(() => {
		loadMenuData(locale);
	}, [locale, loadMenuData]);

	// 初始化菜单展开状态
	useEffect(() => {
		// 根据当前路径计算应该展开的父级菜单
		const currentParentKeys = getParentKeys(menuData, location.pathname);
		setOpenKeys(currentParentKeys);
	}, [getParentKeys, location.pathname, menuData]);

	// 响应路由变化，更新菜单展开状态
	useEffect(() => {
		// 当路径变化时，重新计算应该展开的父级菜单
		const currentParentKeys = getParentKeys(menuData, location.pathname);
		setOpenKeys(currentParentKeys);

		// 在混合布局下，更新当前选中的顶级菜单
		if (menuLayout === 'mixed') {
			setMixedLayoutSelectedTopMenu(getCurrentTopMenu());
		}

		// 如果开启了多标签页，添加当前页面到标签页
		// 只有在 menuData 不为空时才添加，避免刷新时标签页名称为空
		if (showTabs && menuData.length > 0) {
			const menuItem = findMenuItemObjectByPath(menuData, location.pathname);
			if (menuItem) {
				addTab({
					key: location.pathname,
					label: menuItem.label,
					icon: menuItem.icon,
					closable: true,
				});
			}
		}
	}, [
		location.pathname,
		menuLayout,
		showTabs,
		getParentKeys,
		getCurrentTopMenu,
		findMenuItemObjectByPath,
		addTab,
		menuData,
	]);

	// 保存混合布局选中的顶级菜单到 localStorage，用于定宽布局计算
	useEffect(() => {
		if (menuLayout === 'mixed') {
			localStorage.setItem('mixedLayoutSelectedTopMenu', mixedLayoutSelectedTopMenu);
		}
	}, [mixedLayoutSelectedTopMenu, menuLayout]);

	// 将后端菜单数据转换为 Ant Design Menu 格式
	const transformMenuData = (items: MenuItem[]): MenuProps['items'] => {
		const result: MenuProps['items'] = [];
		for (const item of items) {
			// biome-ignore lint/suspicious/noExplicitAny: Ant Design Menu 的 items 类型较为复杂，使用 any 简化类型定义
			const menuItem: any = {
				key: item.key,
				label: item.label,
			};

			// 只有当 icon 存在时才添加
			if (item.icon) {
				menuItem.icon = <i className={item.icon} />;
			}

			// 如果有子菜单，递归转换
			if (item.children && item.children.length > 0) {
				menuItem.children = transformMenuData(item.children);
			}

			result.push(menuItem);
		}
		return result;
	};

	// 获取完整的菜单项（用于垂直和水平布局）
	const fullMenuItems = transformMenuData(menuData);

	// 获取一级菜单项（用于顶部导航）
	const topLevelMenuItems: { key: string; label: string; icon?: React.ReactNode }[] = [];
	for (const item of menuData) {
		const menuItem: { key: string; label: string; icon?: React.ReactNode } = {
			key: item.key,
			label: item.label,
		};

		if (item.icon) {
			menuItem.icon = <i className={item.icon} />;
		}

		topLevelMenuItems.push(menuItem);
	}

	// 根据选中的顶级菜单获取子菜单项
	const getSubMenuItems = (parentKey: string): MenuProps['items'] => {
		const parentMenu = menuData.find((item) => item.key === parentKey);
		if (parentMenu?.children && parentMenu.children.length > 0) {
			return transformMenuData(parentMenu.children);
		}
		return [];
	};

	// 分离一级和二级菜单（用于双列布局）
	const firstLevelItems: { key: string; label: string; icon?: React.ReactNode }[] = [];
	for (const item of topLevelMenuItems) {
		const newItem: { key: string; label: string; icon?: React.ReactNode } = {
			key: item.key,
			label: item.label,
		};

		if (item.icon) {
			newItem.icon = item.icon;
		}

		firstLevelItems.push(newItem);
	}
	const secondLevelItems: MenuItem[] = [];
	for (const item of menuData) {
		if (item.children && item.children.length > 0) {
			secondLevelItems.push(...item.children);
		}
	}

	// 从菜单数据中查找当前路径对应的菜单项 ID
	const getSelectedKey = (): string[] => {
		const selectedId = findMenuItemByPath(menuData, location.pathname);
		return selectedId ? [selectedId] : [];
	};

	// 处理顶部菜单点击
	const handleTopMenuClick = (key: string) => {
		const item = menuData.find((item) => item.key === key);

		// 在混合布局下，设置当前选中的顶级菜单
		if (menuLayout === 'mixed') {
			setMixedLayoutSelectedTopMenu(key);
		}

		// 如果点击的是没有子菜单的项目，直接导航
		if (item && (!item.children || item.children.length === 0) && item.path) {
			navigate(item.path);
		}
	};
	// 根据菜单项 key 查找路径
	const findPathByKey = (items: MenuItem[], key: string): string | null => {
		for (const item of items) {
			if (item.key === key) {
				return item.path || null;
			}
			if (item.children && item.children.length > 0) {
				const found = findPathByKey(item.children, key);
				if (found) return found;
			}
		}
		return null;
	};

	// 根据菜单项 key 查找菜单项对象
	const findMenuItemByKey = (items: MenuItem[], key: string): MenuItem | null => {
		for (const item of items) {
			if (item.key === key) {
				return item;
			}
			if (item.children && item.children.length > 0) {
				const found = findMenuItemByKey(item.children, key);
				if (found) return found;
			}
		}
		return null;
	};

	// 处理菜单点击事件
	const onMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
		// 阻止默认行为，防止可能的整页刷新
		domEvent?.preventDefault();

		// 查找菜单项对象
		const menuItem = findMenuItemByKey(menuData, key);

		// 在水平布局下，点击叶子节点（没有子菜单且有路径）后关闭展开的菜单
		if (
			menuLayout === 'horizontal' &&
			menuItem &&
			(!menuItem.children || menuItem.children.length === 0) &&
			menuItem.path
		) {
			// 使用 setTimeout 确保在 Ant Design 内部处理完成后关闭菜单
			setTimeout(() => {
				setOpenKeys([]);
			}, 100);
		}

		// 只处理叶子节点（没有子菜单的菜单项）的点击
		// 父菜单项（有子菜单的）不会触发导航，只处理展开/收起
		const path = findPathByKey(menuData, key);

		if (path) {
			// 检查权限
			if (!canAccessPage(path)) {
				message.error(commonLocale.permission.noAccess);
				navigate('/403');
				return;
			}

			// 导航
			navigate(path);
		}
	};

	// 处理子菜单展开/关闭
	const onOpenChange = (keys: string[]) => {
		// 在展开状态下才手动控制 openKeys
		// 折叠状态下让 Ant Design 自动处理 hover 子菜单
		// 水平布局下也手动控制，以便实现点击后关闭的功能
		if (!collapsed || menuLayout === 'horizontal') {
			setOpenKeys(keys);
		}
	};

	// 获取多语言文本
	const commonLocale = getCommonLocale(locale);

	// 构建账号菜单配置
	const accountMenuItems = buildAccountMenuItems(locale, commonLocale);

	// 处理账号菜单点击事件
	const handleAccountMenuClick: MenuProps['onClick'] = ({ key }) => {
		handleAccountMenuItemClick(key, navigate, modal, message, commonLocale, handleLogout);
	};

	// 退出登录处理
	const handleLogout = async () => {
		try {
			// 清除本地存储的认证信息
			localStorage.removeItem('auth_token');
			localStorage.removeItem('login_time');
			localStorage.removeItem('last_username');

			// 清除用户信息
			clearUserInfo();

			// 清除所有标签页和缓存，避免新用户看到旧用户的页面
			clearAllTabsAndCache();

			// 显示成功消息
			message.success(commonLocale.accountMenu.logoutSuccess);

			// 延迟 500ms 后重定向到登录页面，让用户看到成功提示
			setTimeout(() => {
				navigate('/login');
			}, 500);
		} catch (error) {
			console.error('退出登录失败：', error);
			message.error(commonLocale.accountMenu.logoutFailed);
		}
	};

	const logoStyle: React.CSSProperties = isFloatingUI
		? {
				position: 'fixed',
				top: '12px',
				left: '12px',
				zIndex: 1000,
				padding: '0 16px',
				height: '48px',
				width:
					menuLayout === 'vertical'
						? collapsed
							? '48px'
							: '240px'
						: menuLayout === 'mixed'
							? collapsed
								? '48px'
								: '200px'
							: '48px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				background: 'var(--ant-color-bg-container)',
				borderRadius: `${borderRadius}px`,
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
				transition: 'width 0.2s',
			}
		: {};

	const siderStyle: React.CSSProperties = {
		background: 'var(--ant-color-bg-container)',
		borderRight: isFloatingUI ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
		height: isFloatingUI ? 'calc(100vh - 24px)' : '100vh',
		boxShadow: isFloatingUI ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'inset -2px 0 8px rgba(0, 0, 0, 0.04)',
		overflowY: 'auto',
		...(isFloatingUI && {
			margin: '12px',
			marginRight: '0',
			marginTop: '74px',
			borderRadius: `${borderRadius}px`,
			height: 'calc(100vh - 86px)',
		}),
	};

	const headerStyle: React.CSSProperties = {
		padding: '0 16px 0 8px',
		background: 'transparent',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: '48px',
		...(isFloatingUI && {
			margin: '12px 12px 0 12px',
			background: 'var(--ant-color-bg-container)',
			borderRadius: `${borderRadius}px`,
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
			padding: '0 6px 0 6px',
		}),
	};

	const contentStyle: React.CSSProperties = {
		marginTop: isFloatingUI ? '12px' : '24px',
		marginBottom: isFloatingUI ? '12px' : '24px',
		marginLeft: isFloatingUI ? '12px' : '24px',
		marginRight: isFloatingUI ? '12px' : '24px',
		padding: showContentBackground ? '32px' : '0',
		background: showContentBackground ? 'var(--ant-color-bg-container)' : 'transparent',
		borderRadius: showContentBackground ? `${borderRadius}px` : '0',
		overflowY: 'auto',
		boxShadow: isFloatingUI && showContentBackground ? '0 2px 8px rgba(0, 0, 0, 0.08)' : undefined,
		...(contentWidth === 'fixed' && {
			width: `${fixedWidthMax}px`,
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: isFloatingUI ? '12px' : '24px',
			marginBottom: isFloatingUI ? '12px' : '24px',
		}),
	};

	// 根据布局模式获取内容区域样式
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 布局样式计算逻辑需要处理多种布局模式和状态组合
	const getContentStyle = (layout: 'vertical' | 'horizontal' | 'mixed'): React.CSSProperties => {
		let height: string;

		if (layout === 'vertical') {
			// 垂直布局：header 48px + 上下间距
			height = isFloatingUI ? 'calc(100vh - 84px)' : 'calc(100vh - 108px)';
		} else if (layout === 'horizontal') {
			// 水平布局：header 48px + tabs(如果有) + 上下间距
			if (showTabs) {
				height = isFloatingUI ? 'calc(100vh - 146px)' : 'calc(100vh - 170px)';
			} else {
				height = isFloatingUI ? 'calc(100vh - 84px)' : 'calc(100vh - 108px)';
			}
		} else {
			// 混合布局：header 48px + tabs(如果有) + 上下间距
			if (showTabs) {
				height = isFloatingUI ? 'calc(100vh - 146px)' : 'calc(100vh - 170px)';
			} else {
				height = isFloatingUI ? 'calc(100vh - 84px)' : 'calc(100vh - 108px)';
			}
		}

		return {
			...contentStyle,
			height,
		};
	};

	// 渲染侧边栏底部工具栏
	const renderSidebarToolbar = () => {
		const containerClass = collapsed
			? 'absolute right-0 bottom-0 left-0 flex flex-col items-center gap-1.5 py-2'
			: 'absolute right-0 bottom-0 left-0 flex flex-col gap-1 px-3 py-2';

		return (
			<div
				className={containerClass}
				style={{
					background: 'var(--ant-color-bg-container)',
					borderTop: '1px solid var(--ant-color-border-secondary)',
				}}
			>
				{/* 自定义图标按钮 - 受 showHeaderButtons 控制 */}
				{showHeaderButtons &&
					toolbarButtons.map((item) => (
						<ToolbarButton
							key={item.key}
							item={item}
							borderRadius={borderRadius}
							collapsed={collapsed}
							locale={locale}
							popoverStates={popoverStates}
							setPopoverStates={setPopoverStates}
						/>
					))}

				{/* 设置按钮 */}
				{collapsed ? (
					<Button
						type="text"
						icon={<i className="ri-settings-3-line icon-spin-hover" style={{ fontSize: '18px' }} />}
						onClick={showDrawer}
						style={{
							width: '40px',
							height: '40px',
							minWidth: '40px',
							minHeight: '40px',
							padding: 0,
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					/>
				) : (
					<Button
						type="text"
						onClick={showDrawer}
						style={{
							width: '100%',
							height: '36px',
							padding: '0 12px',
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
							gap: '10px',
						}}
					>
						<i className="ri-settings-3-line icon-spin-hover" style={{ fontSize: '16px' }} />
						<span className="truncate text-sm">{commonLocale.drawer.systemSettings}</span>
					</Button>
				)}

				{/* 账号菜单 */}
				<Dropdown menu={{ items: accountMenuItems, onClick: handleAccountMenuClick }} placement="topRight">
					{collapsed ? (
						<div
							className="flex cursor-pointer items-center justify-center overflow-hidden p-0"
							style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
						>
							<Avatar
								src={userInfo?.avatar || '/images/default-avatar.jpg'}
								size={40}
								style={{ borderRadius: `${borderRadius}px` }}
							/>
						</div>
					) : (
						<div
							className="flex cursor-pointer items-center gap-2.5 rounded px-3 py-2 transition-colors hover:bg-(--ant-color-fill-secondary)"
							style={{ borderRadius: `${borderRadius}px` }}
						>
							<Avatar
								src={userInfo?.avatar || '/images/default-avatar.jpg'}
								size={32}
								style={{ borderRadius: `${borderRadius}px`, flexShrink: 0 }}
							/>
							<div className="min-w-0 flex-1">
								<div className="truncate font-medium text-sm">{userInfo?.nickname || userInfo?.username || '用户'}</div>
								<div className="truncate text-xs" style={{ color: 'var(--ant-color-text-tertiary)' }}>
									{userInfo?.email || ''}
								</div>
							</div>
						</div>
					)}
				</Dropdown>
			</div>
		);
	};

	// 渲染垂直布局
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 布局渲染函数包含多个条件分支和嵌套结构
	const renderVerticalLayout = () => {
		// 计算侧边栏工具栏高度，用于调整菜单高度
		// 折叠模式：每个按钮 40px + 6px gap + 8px padding * 2
		// 展开模式：每个按钮 36px + 4px gap + 用户区域 52px + 8px padding * 2
		const toolbarHeight = sidebarToolbar
			? collapsed
				? (showHeaderButtons ? toolbarButtons.length * 46 : 0) + 46 + 46 + 16 // 折叠：40px 按钮 + 6px gap
				: (showHeaderButtons ? toolbarButtons.length * 40 : 0) + 40 + 56 + 16 // 展开：带文字按钮 + 用户信息区
			: 0;

		return (
			<Layout style={{ minHeight: '100vh', background: 'transparent' }}>
				{isFloatingUI && (
					// 悬浮模式：Logo 独立悬浮在 Sider 外部
					<div style={logoStyle}>
						<div className={`flex items-center ${collapsed ? '' : 'space-x-2'}`}>
							<system.Logo size={collapsed ? 20 : 18} />
							{!collapsed && <div className="m-0 whitespace-nowrap font-bold text-sm">{commonLocale.system.name}</div>}
						</div>
					</div>
				)}
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					width={240}
					collapsedWidth={48}
					style={{
						...siderStyle,
						position: 'relative',
					}}
				>
					<div
						className="flex flex-col"
						style={{
							height: '100%',
							paddingBottom: sidebarToolbar ? `${toolbarHeight}px` : 0,
						}}
					>
						{!isFloatingUI && (
							// 非悬浮模式：Logo 在 Sider 内部
							<div
								className="flex h-12 shrink-0 items-center justify-center"
								style={{
									padding: collapsed ? '0 16px' : '0 24px',
								}}
							>
								<div className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
									<system.Logo size={18} />
									{!collapsed && <div className="whitespace-nowrap font-bold text-sm">{commonLocale.system.name}</div>}
								</div>
							</div>
						)}

						<div className="flex-1 overflow-y-auto overflow-x-hidden">
							<Menu
								mode="inline"
								items={fullMenuItems}
								selectedKeys={getSelectedKey()}
								openKeys={collapsed ? undefined : openKeys}
								onOpenChange={onOpenChange}
								onClick={onMenuClick}
								style={{
									borderRadius: isFloatingUI ? `${borderRadius}px` : '0',
									...(collapsed && {
										width: '48px',
										margin: '0 auto',
									}),
								}}
							/>
						</div>
					</div>

					{/* 侧边栏底部工具栏 */}
					{sidebarToolbar && renderSidebarToolbar()}
				</Sider>

				<Layout>
					{/* 当侧栏工具栏启用且不显示标签页、刷新按钮、折叠按钮时，隐藏顶部区域 */}
					{!(sidebarToolbar && !showTabs && !showRefreshButton && !showCollapseButton) && (
						<Header style={headerStyle}>
							{sidebarToolbar ? renderHeaderContentWithoutRightButtons() : renderHeaderContent()}
						</Header>
					)}
					<Content style={getContentStyle('vertical')}>
						<system.CachedOutlet />
					</Content>
				</Layout>
			</Layout>
		);
	};

	// 渲染水平布局
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 布局渲染函数包含多个条件分支和嵌套结构
	const renderHorizontalLayout = () => (
		<Layout style={{ minHeight: '100vh', background: 'transparent' }}>
			{isFloatingUI && (
				// 悬浮模式：Logo 独立悬浮在 Header 外部
				<div style={logoStyle}>
					{menuLayout === 'vertical' ? (
						<div className={`flex items-center ${collapsed ? '' : 'space-x-2'}`}>
							<system.Logo size={collapsed ? 20 : 18} />
							{!collapsed && (
								<div className="font-bold text-sm" style={{ margin: 0, whiteSpace: 'nowrap' }}>
									{commonLocale.system.name}
								</div>
							)}
						</div>
					) : menuLayout === 'mixed' ? (
						<div className={`flex items-center ${collapsed ? '' : 'space-x-2'}`}>
							<system.Logo size={collapsed ? 20 : 18} />
							{!collapsed && (
								<div className="font-bold text-sm" style={{ margin: 0, whiteSpace: 'nowrap' }}>
									{commonLocale.system.name}
								</div>
							)}
						</div>
					) : (
						<system.Logo size={20} />
					)}
				</div>
			)}
			<Header
				style={{
					...headerStyle,
					background: 'var(--ant-color-bg-container)',
					...(isFloatingUI && {
						marginLeft: '74px',
					}),
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
					{/* 水平布局没有左侧菜单，logo 区域固定 48px 宽度，只显示图标 */}
					{!isFloatingUI && (
						<div className="flex shrink-0 items-center justify-center" style={{ width: '48px', height: '48px' }}>
							<system.Logo size={18} />
						</div>
					)}

					{showRefreshButton && (
						<Button
							type="text"
							icon={<i className="ri-refresh-line icon-spin-hover" style={{ fontSize: '16px' }} />}
							onClick={() => window.location.reload()}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
								width: '40px',
								height: '40px',
								minWidth: '40px',
								minHeight: '40px',
								padding: 0,
								borderRadius: `${borderRadius}px`,
							}}
						/>
					)}

					<Menu
						mode="horizontal"
						items={fullMenuItems}
						selectedKeys={getSelectedKey()}
						openKeys={openKeys}
						onOpenChange={onOpenChange}
						onClick={onMenuClick}
						className="horizontal-menu-no-arrow"
						style={{
							flex: 1,
							borderBottom: 'none',
							lineHeight: '48px',
							overflow: 'hidden',
							marginLeft: isFloatingUI ? '0' : 'auto',
						}}
					/>

					<div className="flex shrink-0 items-center gap-2">{renderHeaderRightButtons()}</div>
				</div>
			</Header>

			{showTabs && <system.TabsBar />}
			<Content style={getContentStyle('horizontal')}>
				<system.CachedOutlet />
			</Content>
		</Layout>
	);

	// 渲染混合布局
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 布局渲染函数包含多个条件分支和嵌套结构
	const renderMixedLayout = () => (
		<Layout style={{ minHeight: '100vh', background: 'transparent' }}>
			{isFloatingUI && (
				// 悬浮模式：Logo 独立悬浮在 Header 外部
				<div style={logoStyle}>
					{menuLayout === 'vertical' ? (
						<div className={`flex items-center ${collapsed ? '' : 'space-x-2'}`}>
							<system.Logo size={collapsed ? 20 : 18} />
							{!collapsed && (
								<div className="font-bold text-sm" style={{ margin: 0, whiteSpace: 'nowrap' }}>
									{commonLocale.system.name}
								</div>
							)}
						</div>
					) : menuLayout === 'mixed' ? (
						<div className={`flex items-center ${collapsed ? '' : 'space-x-2'}`}>
							<system.Logo size={collapsed ? 20 : 18} />
							{!collapsed && (
								<div className="font-bold text-sm" style={{ margin: 0, whiteSpace: 'nowrap' }}>
									{commonLocale.system.name}
								</div>
							)}
						</div>
					) : (
						<system.Logo size={20} />
					)}
				</div>
			)}
			<Header
				style={{
					...headerStyle,
					background: 'var(--ant-color-bg-container)',
					...(isFloatingUI && {
						marginLeft: menuLayout === 'mixed' ? (collapsed ? '74px' : '224px') : '74px',
					}),
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
					{/* 混合布局：logo 区域宽度跟随左侧子菜单宽度 */}
					{!isFloatingUI &&
						(() => {
							const subMenuItems = getSubMenuItems(mixedLayoutSelectedTopMenu);
							const hasSubMenu = subMenuItems && subMenuItems.length > 0;
							// 有子菜单时：展开 200px / 折叠 48px；无子菜单时：不显示 logo 区域
							if (!hasSubMenu) return null;
							const logoWidth = collapsed ? 48 : 200;
							return (
								<div
									className="flex shrink-0 items-center justify-center"
									style={{ width: `${logoWidth}px`, height: '48px', transition: 'width 0.2s' }}
								>
									<div className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
										<system.Logo size={18} />
										{!collapsed && (
											<div className="whitespace-nowrap font-bold text-sm">{commonLocale.system.name}</div>
										)}
									</div>
								</div>
							);
						})()}

					{showCollapseButton &&
						(() => {
							const subMenuItems = getSubMenuItems(mixedLayoutSelectedTopMenu);
							const hasSubMenu = subMenuItems && subMenuItems.length > 0;
							return hasSubMenu ? (
								<Button
									type="text"
									icon={
										collapsed ? (
											<i className="ri-menu-unfold-line icon-wiggle" style={{ fontSize: '16px' }} />
										) : (
											<i className="ri-menu-fold-line icon-wiggle" style={{ fontSize: '16px' }} />
										)
									}
									onClick={() => setCollapsed(!collapsed)}
									style={{
										width: '40px',
										height: '40px',
										minWidth: '40px',
										minHeight: '40px',
										padding: 0,
										marginRight: '16px',
										borderRadius: `${borderRadius}px`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										overflow: 'hidden',
									}}
								/>
							) : null;
						})()}

					{showRefreshButton && (
						<div className="mr-4 flex shrink-0 items-center gap-2">
							<Button
								type="text"
								icon={<i className="ri-refresh-line icon-spin-hover" style={{ fontSize: '16px' }} />}
								onClick={() => window.location.reload()}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
									width: '40px',
									height: '40px',
									minWidth: '40px',
									minHeight: '40px',
									padding: 0,
									borderRadius: `${borderRadius}px`,
								}}
							/>
						</div>
					)}

					<Menu
						mode="horizontal"
						items={topLevelMenuItems}
						selectedKeys={[mixedLayoutSelectedTopMenu]}
						onClick={({ key }) => handleTopMenuClick(key)}
						className="horizontal-menu-no-arrow"
						style={{
							flex: 1,
							borderBottom: 'none',
							lineHeight: '48px',

							overflow: 'hidden',
						}}
					/>

					<div className="flex shrink-0 items-center gap-2">{renderHeaderRightButtons()}</div>
				</div>
			</Header>

			<Layout style={{ height: isFloatingUI ? 'calc(100vh - 72px)' : 'calc(100vh - 48px)' }}>
				{/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 混合布局中的子菜单渲染逻辑需要多个条件判断 */}
				{(() => {
					const subMenuItems = getSubMenuItems(mixedLayoutSelectedTopMenu);
					const hasSubMenu = subMenuItems && subMenuItems.length > 0;

					return (
						<>
							{hasSubMenu && (
								<Sider
									trigger={null}
									collapsible
									collapsed={collapsed}
									width={200}
									collapsedWidth={48}
									style={{
										background: 'var(--ant-color-bg-container)',
										borderRight: isFloatingUI ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
										height: isFloatingUI ? 'calc(100% - 24px)' : '100%',
										boxShadow: isFloatingUI ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'inset -2px 0 8px rgba(0, 0, 0, 0.04)',
										overflowY: 'auto',
										...(isFloatingUI && {
											margin: '12px',
											marginRight: '0',
											borderRadius: `${borderRadius}px`,
										}),
									}}
								>
									<Menu
										mode="inline"
										items={subMenuItems}
										selectedKeys={getSelectedKey()}
										openKeys={collapsed ? undefined : openKeys}
										onOpenChange={onOpenChange}
										onClick={onMenuClick}
										style={{
											borderRadius: isFloatingUI ? `${borderRadius}px` : '0',
											...(collapsed && {
												width: '48px',
												margin: '0 auto',
											}),
										}}
									/>
								</Sider>
							)}

							<Layout style={{ display: 'flex', flexDirection: 'column' }}>
								{showTabs && <system.TabsBar />}
								<Content style={getContentStyle('mixed')}>
									<system.CachedOutlet />
								</Content>
							</Layout>
						</>
					);
				})()}
			</Layout>
		</Layout>
	);

	// 渲染头部右侧按钮
	const renderHeaderRightButtons = () => {
		return (
			<Space size={2}>
				{/* 自定义图标按钮 - 受 showHeaderButtons 控制 */}
				{showHeaderButtons &&
					toolbarButtons.map((item) => {
						// 判断是否显示红点
						const shouldShowDot = item.popover?.shouldShowDot ? item.popover.shouldShowDot() : item.dot;

						const button = (
							<Button
								key={item.key}
								type="text"
								onClick={item.popover ? undefined : item.onClick}
								style={{
									width: '40px',
									height: '40px',
									minWidth: '40px',
									minHeight: '40px',
									padding: 0,
									borderRadius: `${borderRadius}px`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
								}}
							>
								<span className="relative inline-block leading-none">
									<i
										className={`${item.icon} ${item.animation || ''}`}
										style={{ fontSize: '16px', display: 'inline-block' }}
									/>
									{shouldShowDot && (
										<span
											className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full"
											style={{
												backgroundColor: 'var(--ant-color-error)',
												transform: 'translate(50%, -50%)',
											}}
										/>
									)}
								</span>
							</Button>
						);

						// 如果配置了 Popover，用 Popover 包裹按钮
						if (item.popover) {
							return (
								<Popover
									key={item.key}
									content={item.popover.content({
										onClose: () => setPopoverStates((prev) => ({ ...prev, [item.key]: false })),
									})}
									trigger={item.popover.trigger || 'click'}
									open={popoverStates[item.key] || false}
									onOpenChange={(open) => setPopoverStates((prev) => ({ ...prev, [item.key]: open }))}
									placement={item.popover.placement || 'bottomRight'}
									arrow={item.popover.arrow ?? false}
								>
									{button}
								</Popover>
							);
						}

						return button;
					})}

				{/* 设置按钮 - 始终显示 */}
				<Button
					type="text"
					icon={<i className="ri-settings-3-line icon-spin-hover" style={{ fontSize: '16px' }} />}
					onClick={showDrawer}
					style={{
						width: '40px',
						height: '40px',
						minWidth: '40px',
						minHeight: '40px',
						padding: 0,
						borderRadius: `${borderRadius}px`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
					}}
				/>

				{/* 账号菜单 - 始终显示 */}
				<Dropdown menu={{ items: accountMenuItems, onClick: handleAccountMenuClick }} placement="bottomRight">
					<div className="flex h-10 min-h-10 w-10 min-w-10 cursor-pointer items-center justify-center overflow-hidden p-0">
						<Avatar
							src={userInfo?.avatar || '/images/default-avatar.jpg'}
							size={40}
							style={{
								borderRadius: `${borderRadius}px`,
							}}
						/>
					</div>
				</Dropdown>
			</Space>
		);
	};

	// 渲染头部内容（用于垂直布局）
	const renderHeaderContent = () => (
		<>
			<div className="flex items-center">
				{showCollapseButton && (
					<Button
						type="text"
						icon={
							collapsed ? (
								<i className="ri-menu-unfold-line icon-wiggle" style={{ fontSize: '16px' }} />
							) : (
								<i className="ri-menu-fold-line icon-wiggle" style={{ fontSize: '16px' }} />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							width: '40px',
							height: '40px',
							minWidth: '40px',
							minHeight: '40px',
							padding: 0,
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					/>
				)}

				{showRefreshButton && (
					<Button
						type="text"
						icon={<i className="ri-refresh-line icon-spin-hover" style={{ fontSize: '16px' }} />}
						onClick={() => window.location.reload()}
						style={{
							width: '40px',
							height: '40px',
							minWidth: '40px',
							minHeight: '40px',
							padding: 0,
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					/>
				)}

				{/* 面包屑导航 */}
				{breadcrumbs && breadcrumbs.length > 0 && (
					<Breadcrumb
						items={breadcrumbs.map((item) => ({
							title: item.title,
						}))}
						style={{ marginLeft: '8px' }}
					/>
				)}
			</div>

			{showTabs && <system.TabsBar inHeader={true} />}

			{renderHeaderRightButtons()}
		</>
	);

	// 渲染头部内容（不含右侧按钮，用于侧边栏工具栏模式）
	const renderHeaderContentWithoutRightButtons = () => (
		<>
			<div className="flex items-center">
				{showCollapseButton && (
					<Button
						type="text"
						icon={
							collapsed ? (
								<i className="ri-menu-unfold-line icon-wiggle" style={{ fontSize: '16px' }} />
							) : (
								<i className="ri-menu-fold-line icon-wiggle" style={{ fontSize: '16px' }} />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							width: '40px',
							height: '40px',
							minWidth: '40px',
							minHeight: '40px',
							padding: 0,
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					/>
				)}

				{showRefreshButton && (
					<Button
						type="text"
						icon={<i className="ri-refresh-line icon-spin-hover" style={{ fontSize: '16px' }} />}
						onClick={() => window.location.reload()}
						style={{
							width: '40px',
							height: '40px',
							minWidth: '40px',
							minHeight: '40px',
							padding: 0,
							borderRadius: `${borderRadius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					/>
				)}

				{/* 面包屑导航 */}
				{breadcrumbs && breadcrumbs.length > 0 && (
					<Breadcrumb
						items={breadcrumbs.map((item) => ({
							title: item.title,
						}))}
						style={{ marginLeft: '8px' }}
					/>
				)}
			</div>

			{showTabs && <system.TabsBar inHeader={true} />}

			{/* 空占位，保持布局一致 */}
			<div />
		</>
	);

	// 渲染沉浸模式
	const renderImmersiveMode = () => {
		return (
			<div
				className="relative h-screen w-screen overflow-auto p-6"
				style={{
					background: 'var(--ant-color-bg-container)',
				}}
			>
				{/* 退出沉浸模式按钮 */}
				<div className="fixed top-2 right-2 z-1000">
					<Button
						type="primary"
						icon={<i className="ri-fullscreen-exit-line" style={{ fontSize: '12px' }} />}
						onClick={() => setImmersiveMode(false)}
						style={{
							width: '28px',
							height: '28px',
							minWidth: '28px',
							minHeight: '28px',
							padding: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: `${borderRadius}px`,
							boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
						}}
					/>
				</div>
				<system.CachedOutlet />
			</div>
		);
	};

	// 根据菜单布局模式渲染不同的布局
	return (
		<div
			className="min-h-screen"
			style={{
				backgroundColor: isFloatingUI ? 'var(--ant-color-bg-layout)' : 'var(--ant-color-bg-container)',
			}}
		>
			{isImmersiveMode ? (
				renderImmersiveMode()
			) : (
				<>
					{menuLayout === 'vertical' && renderVerticalLayout()}
					{menuLayout === 'horizontal' && renderHorizontalLayout()}
					{menuLayout === 'mixed' && renderMixedLayout()}
				</>
			)}
			{/* 系统设置抽屉 */}
			<system.SystemSettingsDrawer open={open} onClose={hideDrawer} />
		</div>
	);
}

export default AppLayout;
