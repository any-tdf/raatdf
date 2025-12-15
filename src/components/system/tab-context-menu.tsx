import { useCallback, useEffect, useState } from 'react';
import { getCommonLocale } from '@/locales';
import { useSystemStore } from '@/store';

interface ContextMenuPosition {
	x: number;
	y: number;
	visible: boolean;
	tabKey?: string;
}

/**
 * 标签页右键菜单组件
 */
function TabContextMenu() {
	const { tabs, activeTabKey, removeTab, setActiveTabKey, pinTab, unpinTab, locale } = useSystemStore();
	const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0, visible: false });
	const t = getCommonLocale(locale);

	// 处理右键菜单关闭
	const handleCloseMenu = useCallback(() => {
		setPosition((prev) => ({ ...prev, visible: false }));
	}, []);

	// 固定标签页
	const handlePinTab = () => {
		if (!position.tabKey) return;
		pinTab(position.tabKey);
		handleCloseMenu();
	};

	// 取消固定标签页
	const handleUnpinTab = () => {
		if (!position.tabKey) return;
		unpinTab(position.tabKey);
		handleCloseMenu();
	};

	// 关闭左侧标签页
	const handleCloseLeft = () => {
		if (!position.tabKey) return;

		const targetIndex = tabs.findIndex((t) => t.key === position.tabKey);
		if (targetIndex <= 0) {
			handleCloseMenu();
			return;
		}

		// 关闭目标前的所有标签页
		for (let i = targetIndex - 1; i >= 0; i--) {
			removeTab(tabs[i].key);
		}

		handleCloseMenu();
	};

	// 关闭右侧标签页
	const handleCloseRight = () => {
		if (!position.tabKey) return;

		const targetIndex = tabs.findIndex((t) => t.key === position.tabKey);
		if (targetIndex >= tabs.length - 1) {
			handleCloseMenu();
			return;
		}

		// 关闭目标后的所有标签页
		for (let i = tabs.length - 1; i > targetIndex; i--) {
			removeTab(tabs[i].key);
		}

		handleCloseMenu();
	};

	// 关闭其他标签页
	const handleCloseOthers = () => {
		if (!position.tabKey) return;

		// 关闭除了目标和当前激活的所有标签页
		const newTabs = tabs.filter((t) => t.key !== position.tabKey);
		for (const tab of newTabs) {
			if (tab.key !== position.tabKey) {
				removeTab(tab.key);
			}
		}

		// 如果关闭的不是当前激活的标签页，需要激活这个标签页
		if (activeTabKey !== position.tabKey) {
			setActiveTabKey(position.tabKey);
		}

		handleCloseMenu();
	};

	// 全局右键事件监听
	useEffect(() => {
		const handleContextMenu = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			// 检查是否在标签页元素上右键
			const tabElement = target.closest('[data-tab-key]');

			if (tabElement) {
				e.preventDefault();

				const tabKey = tabElement.getAttribute('data-tab-key');

				setPosition({
					x: e.clientX,
					y: e.clientY,
					visible: true,
					tabKey: tabKey || undefined,
				});
			} else {
				handleCloseMenu();
			}
		};

		const handleClickOutside = () => {
			handleCloseMenu();
		};

		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu);
			document.removeEventListener('click', handleClickOutside);
		};
	}, [handleCloseMenu]);

	if (!position.visible) {
		return null;
	}

	const targetIndex = position.tabKey ? tabs.findIndex((t) => t.key === position.tabKey) : -1;
	const targetTab = targetIndex >= 0 ? tabs[targetIndex] : null;
	const isPinned = targetTab?.pinned || false;
	const canCloseLeft = targetIndex > 0;
	const canCloseRight = targetIndex < tabs.length - 1;
	const canCloseOthers = tabs.length > 1;

	return (
		<>
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
			`}</style>
			<div
				className="fixed z-10000 min-w-[140px] origin-top-left animate-[fadeIn_0.2s_ease-out] overflow-hidden rounded-lg border p-1 shadow-md"
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
					background: 'var(--ant-color-bg-elevated)',
					borderColor: 'var(--ant-color-border)',
				}}
			>
				{/* 固定/取消固定 */}
				{isPinned ? (
					<button
						type="button"
						onClick={handleUnpinTab}
						className="flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
						style={{
							cursor: 'pointer',
							color: 'var(--ant-color-text)',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'transparent';
						}}
					>
						<i className="ri-unpin-line text-xs" />
						<span>{t.tabContextMenu.unpin}</span>
					</button>
				) : (
					<button
						type="button"
						onClick={handlePinTab}
						className="flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
						style={{
							cursor: 'pointer',
							color: 'var(--ant-color-text)',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'transparent';
						}}
					>
						<i className="ri-pushpin-line text-xs" />
						<span>{t.tabContextMenu.pin}</span>
					</button>
				)}

				{/* 分隔线 */}
				<div className="my-1 h-px" style={{ background: 'var(--ant-color-border)' }} />

				{/* 关闭左侧 */}
				<button
					type="button"
					onClick={handleCloseLeft}
					disabled={!canCloseLeft}
					className="flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
					style={{
						cursor: canCloseLeft ? 'pointer' : 'not-allowed',
						color: canCloseLeft ? 'var(--ant-color-text)' : 'var(--ant-color-text-disabled)',
					}}
					onMouseEnter={(e) => {
						if (canCloseLeft) {
							e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
						}
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'transparent';
					}}
				>
					<i className="ri-arrow-left-line text-xs" />
					<span>{t.tabContextMenu.closeLeft}</span>
				</button>

				{/* 关闭右侧 */}
				<button
					type="button"
					onClick={handleCloseRight}
					disabled={!canCloseRight}
					className="flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
					style={{
						cursor: canCloseRight ? 'pointer' : 'not-allowed',
						color: canCloseRight ? 'var(--ant-color-text)' : 'var(--ant-color-text-disabled)',
					}}
					onMouseEnter={(e) => {
						if (canCloseRight) {
							e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
						}
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'transparent';
					}}
				>
					<i className="ri-arrow-right-line text-xs" />
					<span>{t.tabContextMenu.closeRight}</span>
				</button>

				{/* 关闭其他 */}
				<button
					type="button"
					onClick={handleCloseOthers}
					disabled={!canCloseOthers}
					className="flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
					style={{
						cursor: canCloseOthers ? 'pointer' : 'not-allowed',
						color: canCloseOthers ? 'var(--ant-color-text)' : 'var(--ant-color-text-disabled)',
					}}
					onMouseEnter={(e) => {
						if (canCloseOthers) {
							e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
						}
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'transparent';
					}}
				>
					<i className="ri-close-circle-line text-xs" />
					<span>{t.tabContextMenu.closeOthers}</span>
				</button>
			</div>
		</>
	);
}

export default TabContextMenu;
