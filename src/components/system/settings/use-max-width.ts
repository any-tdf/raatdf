import { useCallback, useEffect, useRef, useState } from 'react';

import type { MenuLayout } from '@/store';
import { useMenuStore, useSystemStore } from '@/store';

interface UseMaxWidthOptions {
	menuLayout: MenuLayout;
	isFloatingUI: boolean;
	menuCollapsed: boolean;
	fixedWidthMax: number;
	setFixedWidthMax: (value: number) => void;
}

export const useMaxWidth = ({
	menuLayout,
	isFloatingUI,
	menuCollapsed,
	fixedWidthMax,
	setFixedWidthMax,
}: UseMaxWidthOptions) => {
	const menuData = useMenuStore((state) => state.menuData);
	const activeTopMenuKey = useSystemStore((state) => state.activeTopMenuKey);

	const calculateMaxWidth = useCallback(() => {
		const viewportWidth = window.innerWidth;
		let parentWidth = viewportWidth;

		if (menuLayout === 'vertical') {
			parentWidth -= (menuCollapsed ? 50 : 240) + (isFloatingUI ? 12 : 0);
		} else if (menuLayout === 'mixed') {
			const parentMenu = menuData.find((item) => item.key === activeTopMenuKey);
			if (parentMenu?.children?.length) {
				parentWidth -= (menuCollapsed ? 50 : 200) + (isFloatingUI ? 12 : 0);
			}
		}

		return Math.max(600, parentWidth - (isFloatingUI ? 24 : 48));
	}, [activeTopMenuKey, isFloatingUI, menuCollapsed, menuData, menuLayout]);

	const [maxWidthValue, setMaxWidthValue] = useState(calculateMaxWidth);
	const fixedWidthMaxRef = useRef(fixedWidthMax);

	useEffect(() => {
		fixedWidthMaxRef.current = fixedWidthMax;
	}, [fixedWidthMax]);

	useEffect(() => {
		const updateMaxWidth = () => {
			const nextMaxWidth = calculateMaxWidth();
			setMaxWidthValue(nextMaxWidth);
			if (fixedWidthMaxRef.current > nextMaxWidth) setFixedWidthMax(nextMaxWidth);
		};

		updateMaxWidth();
		window.addEventListener('resize', updateMaxWidth);
		return () => window.removeEventListener('resize', updateMaxWidth);
	}, [calculateMaxWidth, setFixedWidthMax]);

	return maxWidthValue;
};
