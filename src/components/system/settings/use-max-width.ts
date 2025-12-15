/**
 * 定宽布局最大宽度计算 Hook
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MenuItem } from '@/api/mocks/menu';
import type { MenuLayout } from '@/store';
import { useMenuStore } from '@/store/menu-store';

interface UseMaxWidthOptions {
	menuLayout: MenuLayout;
	isFloatingUI: boolean;
	showCollapseButton: boolean;
	menuCollapsed: boolean;
	fixedWidthMax: number;
	setFixedWidthMax: (value: number) => void;
}

export function useMaxWidth({
	menuLayout,
	isFloatingUI,
	showCollapseButton,
	menuCollapsed,
	fixedWidthMax,
	setFixedWidthMax,
}: UseMaxWidthOptions) {
	const { menuData } = useMenuStore();

	// 计算定宽布局的最大可用宽度
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 布局计算逻辑需要处理多种布局模式和状态组合
	const calculateMaxWidth = useCallback(() => {
		const viewportWidth = window.innerWidth;

		// 确定实际的菜单折叠状态
		let actualCollapsed = menuCollapsed;
		if (showCollapseButton) {
			const savedCollapsed = localStorage.getItem('ant_admin_menu_collapsed');
			actualCollapsed = savedCollapsed !== null ? JSON.parse(savedCollapsed) : false;
		}

		let parentWidth = viewportWidth;

		if (menuLayout === 'vertical') {
			const siderWidth = actualCollapsed ? 50 : 240;
			const siderMarginLeft = isFloatingUI ? 12 : 0;
			parentWidth = viewportWidth - siderWidth - siderMarginLeft;
		} else if (menuLayout === 'mixed') {
			const mixedLayoutSelectedTopMenu = localStorage.getItem('mixedLayoutSelectedTopMenu') || 'dashboard';
			const parentMenu = menuData.find((item: MenuItem) => item.key === mixedLayoutSelectedTopMenu);
			const hasSubMenu = parentMenu?.children && parentMenu.children.length > 0;

			if (hasSubMenu) {
				const siderWidth = actualCollapsed ? 50 : 200;
				const siderMarginLeft = isFloatingUI ? 12 : 0;
				parentWidth = viewportWidth - siderWidth - siderMarginLeft;
			}
		}

		const contentMarginLeft = isFloatingUI ? 12 : 24;
		const contentMarginRight = isFloatingUI ? 12 : 24;
		const maxWidth = parentWidth - contentMarginLeft - contentMarginRight;

		return Math.max(600, maxWidth);
	}, [menuLayout, isFloatingUI, showCollapseButton, menuCollapsed, menuData]);

	const [maxWidthValue, setMaxWidthValue] = useState(calculateMaxWidth());
	const fixedWidthMaxRef = useRef(fixedWidthMax);

	// 保持 ref 与最新的 fixedWidthMax 同步
	useEffect(() => {
		fixedWidthMaxRef.current = fixedWidthMax;
	}, [fixedWidthMax]);

	// 保存上次的 localStorage 状态，用于检测变化
	const prevCollapsedStateRef = useRef(showCollapseButton ? localStorage.getItem('ant_admin_menu_collapsed') : null);
	const prevMixedLayoutMenuRef = useRef(
		menuLayout === 'mixed' ? localStorage.getItem('mixedLayoutSelectedTopMenu') : null
	);

	// 监听窗口大小和相关状态变化
	useEffect(() => {
		const newMaxWidth = calculateMaxWidth();
		setMaxWidthValue(newMaxWidth);

		if (fixedWidthMaxRef.current > newMaxWidth) {
			setFixedWidthMax(newMaxWidth);
		}

		const handleResize = () => {
			const resizeMaxWidth = calculateMaxWidth();
			setMaxWidthValue(resizeMaxWidth);
			if (fixedWidthMaxRef.current > resizeMaxWidth) {
				setFixedWidthMax(resizeMaxWidth);
			}
		};

		// 定期检查 localStorage 中的变化
		let checkInterval: ReturnType<typeof setInterval> | null = null;
		if (showCollapseButton || menuLayout === 'mixed') {
			// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 需要监听多个状态变化并触发相应的重新计算
			checkInterval = setInterval(() => {
				let needsRecalculate = false;

				if (showCollapseButton) {
					const currentCollapsedState = localStorage.getItem('ant_admin_menu_collapsed');
					if (prevCollapsedStateRef.current !== currentCollapsedState) {
						prevCollapsedStateRef.current = currentCollapsedState;
						needsRecalculate = true;
					}
				}

				if (menuLayout === 'mixed') {
					const currentMixedLayoutMenu = localStorage.getItem('mixedLayoutSelectedTopMenu');
					if (prevMixedLayoutMenuRef.current !== currentMixedLayoutMenu) {
						prevMixedLayoutMenuRef.current = currentMixedLayoutMenu;
						needsRecalculate = true;
					}
				}

				if (needsRecalculate) {
					const newMaxWidth = calculateMaxWidth();
					setMaxWidthValue(newMaxWidth);
					if (fixedWidthMaxRef.current > newMaxWidth) {
						setFixedWidthMax(newMaxWidth);
					}
				}
			}, 100);
		}

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			if (checkInterval) {
				clearInterval(checkInterval);
			}
		};
	}, [menuLayout, showCollapseButton, setFixedWidthMax, calculateMaxWidth]);

	return maxWidthValue;
}
