import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCommonLocale } from '@/locales';
import { useSystemStore } from '@/store';

interface ContextMenuPosition {
	x: number;
	y: number;
	visible: boolean;
	tabKey?: string;
}

interface ContextActionProps {
	disabled?: boolean;
	icon: string;
	label: string;
	onClick: () => void;
}

const ContextAction = ({ disabled = false, icon, label, onClick }: ContextActionProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className="tab-context-action flex w-full items-center gap-2 rounded-md border-0 bg-transparent p-2 text-left text-xs transition-colors"
	>
		<i className={`${icon} text-xs`} aria-hidden="true" />
		<span>{label}</span>
	</button>
);

const TabContextMenu = () => {
	const navigate = useNavigate();
	const { tabs, pinTab, unpinTab, closeTabsLeft, closeTabsRight, closeOtherTabs, locale } = useSystemStore();
	const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0, visible: false });
	const t = getCommonLocale(locale);

	const closeMenu = useCallback(() => {
		setPosition((current) => ({ ...current, visible: false }));
	}, []);

	const navigateAfterMutation = (activePath: string | null) => {
		if (activePath) void navigate(activePath);
		closeMenu();
	};

	useEffect(() => {
		const handleContextMenu = (event: MouseEvent) => {
			const tabElement = (event.target as HTMLElement).closest<HTMLElement>('[data-tab-key]');
			if (!tabElement) {
				closeMenu();
				return;
			}

			event.preventDefault();
			const menuWidth = 160;
			const menuHeight = 190;
			setPosition({
				x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
				y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8)),
				visible: true,
				tabKey: tabElement.dataset.tabKey,
			});
		};
		const handlePointerDown = () => closeMenu();
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeMenu();
		};

		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('contextmenu', handleContextMenu);
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [closeMenu]);

	if (!position.visible || !position.tabKey) return null;

	const targetIndex = tabs.findIndex((tab) => tab.key === position.tabKey);
	const targetTab = tabs[targetIndex];
	if (!targetTab) return null;
	const isRemovable = (tab: (typeof tabs)[number]) => !tab.pinned && tab.closable !== false;
	const canCloseLeft = tabs.slice(0, targetIndex).some(isRemovable);
	const canCloseRight = tabs.slice(targetIndex + 1).some(isRemovable);
	const canCloseOthers = tabs.some((tab) => tab.key !== targetTab.key && isRemovable(tab));

	return (
		<div
			role="menu"
			aria-label={t.tabContextMenu.actionsLabel}
			className="tab-context-menu fixed z-10000 origin-top-left overflow-hidden rounded-lg border p-1 shadow-md"
			style={{
				left: position.x,
				top: position.y,
				background: 'var(--ant-color-bg-elevated)',
				borderColor: 'var(--ant-color-border)',
			}}
			onPointerDown={(event) => event.stopPropagation()}
		>
			<ContextAction
				icon={targetTab.pinned ? 'ri-unpin-line' : 'ri-pushpin-line'}
				label={targetTab.pinned ? t.tabContextMenu.unpin : t.tabContextMenu.pin}
				onClick={() => {
					if (targetTab.pinned) unpinTab(targetTab.key);
					else pinTab(targetTab.key);
					closeMenu();
				}}
			/>
			<div className="my-1 h-px" style={{ background: 'var(--ant-color-border)' }} />
			<ContextAction
				disabled={!canCloseLeft}
				icon="ri-arrow-left-line"
				label={t.tabContextMenu.closeLeft}
				onClick={() => navigateAfterMutation(closeTabsLeft(targetTab.key).activePath)}
			/>
			<ContextAction
				disabled={!canCloseRight}
				icon="ri-arrow-right-line"
				label={t.tabContextMenu.closeRight}
				onClick={() => navigateAfterMutation(closeTabsRight(targetTab.key).activePath)}
			/>
			<ContextAction
				disabled={!canCloseOthers}
				icon="ri-close-circle-line"
				label={t.tabContextMenu.closeOthers}
				onClick={() => navigateAfterMutation(closeOtherTabs(targetTab.key).activePath)}
			/>
		</div>
	);
};

export default TabContextMenu;
