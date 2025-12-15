import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type MenuItem, useMenuStore, useSystemStore } from '@/store';
import { TabsStyle } from '@/store/types';

interface TabsBarProps {
	inHeader?: boolean;
}

// 检测是否为 Mac 系统
const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

/**
 * 多标签页组件
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 需要处理多种标签页样式（默认、按钮、简洁、卡片）
function TabsBar({ inHeader = false }: TabsBarProps) {
	const { tabs, activeTabKey, borderRadius, isFloatingUI, tabsStyle, isDark, removeTab, setActiveTabKey, unpinTab } =
		useSystemStore();
	const { menuData } = useMenuStore();
	const navigate = useNavigate();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 递归查找菜单项的辅助函数（返回完整对象）
	const findMenuItemByPath = useCallback((items: MenuItem[], path: string): MenuItem | null => {
		for (const item of items) {
			if (item.path === path) {
				return item;
			}
			if (item.children && item.children.length > 0) {
				const found = findMenuItemByPath(item.children, path);
				if (found) return found;
			}
		}
		return null;
	}, []);

	// 获取标签页的显示名称（从当前菜单数据中动态获取）
	const getTabLabel = useCallback(
		(tabKey: string, fallbackLabel: string): string => {
			const menuItem = findMenuItemByPath(menuData, tabKey);
			return menuItem?.label || fallbackLabel;
		},
		[menuData, findMenuItemByPath]
	);

	// 点击标签页
	const handleTabClick = (key: string) => {
		setActiveTabKey(key);
		navigate(key);
	};

	// 关闭标签页
	const handleTabClose = (e: React.MouseEvent, key: string) => {
		e.stopPropagation();
		const { tabs, activeTabKey } = useSystemStore.getState();

		// 如果只剩一个标签页，不允许关闭
		if (tabs.length <= 1) {
			return;
		}

		// 计算关闭后应该激活的标签页
		const closingIndex = tabs.findIndex((t) => t.key === key);
		const isClosingActive = activeTabKey === key;

		removeTab(key);

		// 如果关闭的是当前激活的标签页，需要导航到新的激活标签页
		if (isClosingActive) {
			const newTabs = tabs.filter((t) => t.key !== key);
			if (newTabs.length > 0) {
				// 优先选择关闭标签页右边的，如果没有则选择左边的
				const newActiveIndex = closingIndex >= newTabs.length ? newTabs.length - 1 : closingIndex;
				navigate(newTabs[newActiveIndex].key);
			}
		}
	};

	// 取消固定标签页
	const handleUnpinTab = (_e: React.MouseEvent, key: string) => {
		unpinTab(key);
	};

	// 获取标签页样式
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 需要处理多种标签页样式（默认、按钮、简洁、卡片）的复杂布局计算
	const getTabStyle = (isActive: boolean, index: number, _total: number, activeIndex: number) => {
		const baseStyle: React.CSSProperties = {
			cursor: 'pointer',
			fontSize: inHeader ? '12px' : '13px',
			whiteSpace: 'nowrap',
			lineHeight: '1.2',
			height: inHeader ? '32px' : 'auto',
			display: 'flex',
			alignItems: 'center',
			transition: 'all 0.2s',
		};

		switch (tabsStyle) {
			case TabsStyle.BUTTON:
				// 按钮式：没有高亮的为常规按钮，高亮的为主题色按钮
				return {
					...baseStyle,
					padding: inHeader ? '4px 12px' : '6px 16px',
					borderRadius: `${borderRadius}px`,
					background: isActive ? 'var(--ant-color-primary)' : 'var(--ant-color-bg-elevated)',
					color: isActive ? '#ffffff' : 'var(--ant-color-text)',
					border: 'none',
					boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
				};

			case TabsStyle.SIMPLE:
				// 简洁式：完全没有装饰元素，之间有小竖线分割，高亮的文字为主题色
				return {
					...baseStyle,
					padding: inHeader ? '4px 12px' : '6px 16px',
					borderRadius: '0',
					background: 'transparent',
					color: isActive ? 'var(--ant-color-primary)' : 'var(--ant-color-text-secondary)',
					border: 'none',
					position: 'relative' as const,
				};

			case TabsStyle.CARD: {
				// 卡片式：有堆叠效果，激活的完全展示，激活后面的 tab 整体往右移
				const isAfterActive = index > activeIndex;
				let marginLeft = '0';

				if (index === 0) {
					marginLeft = '0';
				} else if (index === activeIndex + 1) {
					// 激活 tab 的下一个，往右移动更多（相对于正常堆叠）
					marginLeft = '-8px';
				} else if (isAfterActive) {
					// 激活 tab 后面的其他 tab，正常堆叠（但因为前面移动了，整体也往右了）
					marginLeft = '-32px';
				} else {
					// 激活 tab 和之前的 tab 正常堆叠
					marginLeft = '-32px';
				}

				return {
					...baseStyle,
					padding: isActive ? (inHeader ? '6px 14px' : '8px 18px') : inHeader ? '4px 12px' : '6px 16px',
					fontSize: isActive ? (inHeader ? '13px' : '14px') : inHeader ? '12px' : '13px',
					borderRadius: `${borderRadius}px`,
					background: isActive ? 'var(--ant-color-primary)' : 'var(--ant-color-bg-container)',
					color: isActive ? '#ffffff' : 'var(--ant-color-text)',
					border: '1px solid var(--ant-color-border)',
					boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
					marginLeft,
					zIndex: isActive ? 10 : 1,
					position: 'relative' as const,
				};
			}

			default:
				// 默认样式 (原来的样式)
				return {
					...baseStyle,
					padding: inHeader ? '4px 8px' : '6px 12px',
					borderRadius: `${borderRadius}px`,
					background: isActive ? 'var(--ant-color-primary-bg)' : 'transparent',
					color: isActive ? 'var(--ant-color-primary)' : 'var(--ant-color-text-secondary)',
					border: isActive ? '1px solid var(--ant-color-primary-border)' : '1px solid transparent',
				};
		}
	};

	// 获取动作按钮的样式
	const getActionButtonStyle = (isActive: boolean) => ({
		width: '16px',
		height: '16px',
		marginRight: '0',
		marginLeft: '0',
		...((tabsStyle === TabsStyle.BUTTON || tabsStyle === TabsStyle.CARD) && isActive
			? { color: '#ffffff' }
			: { color: 'var(--ant-color-text-secondary)' }),
	});

	// 获取非激活标签页的 hover 背景色
	const getInactiveHoverBackground = (): string => {
		if (tabsStyle === TabsStyle.BUTTON) {
			return isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
		}
		return isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)';
	};

	// 主标签页 hover 进入时的背景色
	const getTabButtonHoverBackground = (isActive: boolean): string => {
		if (tabsStyle === TabsStyle.DEFAULT || tabsStyle === TabsStyle.BUTTON) {
			if (isActive) {
				return tabsStyle === TabsStyle.BUTTON ? 'var(--ant-color-primary-hover)' : 'var(--ant-color-primary-bg-hover)';
			}
			return getInactiveHoverBackground();
		}
		return '';
	};

	// 主标签页 hover 离开时的背景色
	const getTabButtonLeaveBackground = (isActive: boolean): string => {
		if (tabsStyle === TabsStyle.DEFAULT || tabsStyle === TabsStyle.BUTTON) {
			if (isActive) {
				return tabsStyle === TabsStyle.BUTTON ? 'var(--ant-color-primary)' : 'var(--ant-color-primary-bg)';
			}
			return tabsStyle === TabsStyle.BUTTON ? 'var(--ant-color-bg-elevated)' : 'transparent';
		}
		return '';
	};

	if (tabs.length === 0) {
		return null;
	}

	return (
		<div
			style={{
				flex: inHeader ? 1 : 'auto',
				maxHeight: inHeader ? '40px' : 'auto',
				overflow: inHeader ? 'hidden' : 'visible',
			}}
		>
			<div
				ref={scrollContainerRef}
				className={`tabs-scroll-container flex flex-nowrap items-center overflow-auto overflow-y-hidden ${inHeader ? 'gap-1' : tabsStyle === TabsStyle.SIMPLE ? 'gap-0' : 'gap-2'}`}
				style={{
					padding: inHeader ? '0 2px' : isFloatingUI ? '8px 12px' : '4px 24px',
					background: inHeader ? 'transparent' : isFloatingUI ? 'var(--ant-color-bg-container)' : 'transparent',
					borderRadius: inHeader ? '0' : isFloatingUI ? `${borderRadius}px` : '0',
					margin: inHeader ? '0' : isFloatingUI ? '12px 12px 0 12px' : '0',
					boxShadow: inHeader ? 'none' : isFloatingUI ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
					maxHeight: inHeader ? '40px' : 'auto',
					height: inHeader ? '40px' : 'auto',
				}}
			>
				{/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 标签页项目渲染需要处理多种交互场景 */}
				{tabs.map((tab, index) => {
					const isActive = tab.key === activeTabKey;
					const activeIndex = tabs.findIndex((t) => t.key === activeTabKey);
					return (
						<div key={tab.key} data-tab-key={tab.key} className="relative flex items-center">
							{/* 主标签页按钮（包含关闭/固定按钮在内） */}
							<button
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className="group flex cursor-pointer items-center gap-0.5 border-0 p-0"
								style={getTabStyle(isActive, index, tabs.length, activeIndex)}
								onMouseEnter={(e) => {
									const bgColor = getTabButtonHoverBackground(isActive);
									if (bgColor) {
										e.currentTarget.style.backgroundColor = bgColor;
									}
								}}
								onMouseLeave={(e) => {
									const bgColor = getTabButtonLeaveBackground(isActive);
									if (bgColor) {
										e.currentTarget.style.backgroundColor = bgColor;
									}
								}}
							>
								{/* Mac 系统：关闭/固定按钮在左侧 */}
								{tab.closable !== false && tabs.length > 1 && isMac && (
									// biome-ignore lint/a11y/useSemanticElements: 关闭按钮需要在主按钮内部，使用 span 避免嵌套 button
									<span
										role="button"
										tabIndex={0}
										className={`flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-all ${inHeader ? 'text-xs' : 'text-sm'}`}
										style={{
											...getActionButtonStyle(isActive),
											marginRight: '2px',
											width: '16px',
											height: '16px',
										}}
										onClick={(e) => {
											e.stopPropagation();
											if (tab.pinned) {
												handleUnpinTab(e as unknown as React.MouseEvent, tab.key);
											} else {
												handleTabClose(e as unknown as React.MouseEvent, tab.key);
											}
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												if (tab.pinned) {
													unpinTab(tab.key);
												} else {
													const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
													handleTabClose(mockEvent, tab.key);
												}
											}
										}}
										onMouseEnter={(e) => {
											if ((tabsStyle === TabsStyle.BUTTON || tabsStyle === TabsStyle.CARD) && isActive) {
												(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
											} else {
												(e.currentTarget as HTMLElement).style.backgroundColor = isDark
													? 'rgba(255, 255, 255, 0.1)'
													: 'rgba(0, 0, 0, 0.1)';
											}
										}}
										onMouseLeave={(e) => {
											(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
										}}
										aria-label={tab.pinned ? '取消固定标签页' : '关闭标签页'}
									>
										<i className={tab.pinned ? 'ri-pushpin-fill' : 'ri-close-line'} />
									</span>
								)}
								{tab.icon && (
									<i
										className={`${tab.icon} ${inHeader ? 'text-xs' : 'text-sm'}`}
										style={{
											...((tabsStyle === TabsStyle.BUTTON || tabsStyle === TabsStyle.CARD) &&
												isActive && { color: '#ffffff' }),
										}}
									/>
								)}
								<span>{getTabLabel(tab.key, tab.label)}</span>
								{/* 非 Mac 系统：关闭/固定按钮在右侧 */}
								{tab.closable !== false && tabs.length > 1 && !isMac && (
									// biome-ignore lint/a11y/useSemanticElements: 关闭按钮需要在主按钮内部，使用 span 避免嵌套 button
									<span
										role="button"
										tabIndex={0}
										className={`flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-all ${inHeader ? 'text-xs' : 'text-sm'}`}
										style={{
											...getActionButtonStyle(isActive),
											marginLeft: '2px',
											width: '16px',
											height: '16px',
										}}
										onClick={(e) => {
											e.stopPropagation();
											if (tab.pinned) {
												handleUnpinTab(e as unknown as React.MouseEvent, tab.key);
											} else {
												handleTabClose(e as unknown as React.MouseEvent, tab.key);
											}
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												if (tab.pinned) {
													unpinTab(tab.key);
												} else {
													const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
													handleTabClose(mockEvent, tab.key);
												}
											}
										}}
										onMouseEnter={(e) => {
											if ((tabsStyle === TabsStyle.BUTTON || tabsStyle === TabsStyle.CARD) && isActive) {
												(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
											} else {
												(e.currentTarget as HTMLElement).style.backgroundColor = isDark
													? 'rgba(255, 255, 255, 0.1)'
													: 'rgba(0, 0, 0, 0.1)';
											}
										}}
										onMouseLeave={(e) => {
											(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
										}}
										aria-label={tab.pinned ? '取消固定标签页' : '关闭标签页'}
									>
										<i className={tab.pinned ? 'ri-pushpin-fill' : 'ri-close-line'} />
									</span>
								)}
							</button>
							{/* 简洁式的分隔线 */}
							{tabsStyle === TabsStyle.SIMPLE && index < tabs.length - 1 && (
								<div
									className="m-0 w-px"
									style={{
										height: inHeader ? '16px' : '20px',
										background: 'var(--ant-color-border)',
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default TabsBar;
