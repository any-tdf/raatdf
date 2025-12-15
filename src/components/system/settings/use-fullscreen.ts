/**
 * 全屏状态管理 Hook
 */
import { useEffect, useState } from 'react';
import type { DocumentWithFullscreen, HTMLElementWithFullscreen } from '@/types/browser';

export function useFullscreen() {
	const [isFullscreen, setIsFullscreen] = useState(false);

	// 检查全屏状态
	useEffect(() => {
		const checkFullscreen = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		// 监听全屏状态变化
		document.addEventListener('fullscreenchange', checkFullscreen);
		document.addEventListener('webkitfullscreenchange', checkFullscreen);
		document.addEventListener('mozfullscreenchange', checkFullscreen);
		document.addEventListener('MSFullscreenChange', checkFullscreen);

		return () => {
			document.removeEventListener('fullscreenchange', checkFullscreen);
			document.removeEventListener('webkitfullscreenchange', checkFullscreen);
			document.removeEventListener('mozfullscreenchange', checkFullscreen);
			document.removeEventListener('MSFullscreenChange', checkFullscreen);
		};
	}, []);

	// 处理全屏切换
	const toggleFullscreen = () => {
		if (isFullscreen) {
			exitFullscreen();
		} else {
			enterFullscreen();
		}
	};

	return { isFullscreen, toggleFullscreen };
}

/**
 * 进入全屏模式
 */
function enterFullscreen() {
	const element = document.documentElement as HTMLElementWithFullscreen;
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

/**
 * 退出全屏模式
 */
function exitFullscreen() {
	const doc = document as DocumentWithFullscreen;
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (doc.webkitExitFullscreen) {
		doc.webkitExitFullscreen();
	} else if (doc.mozCancelFullScreen) {
		doc.mozCancelFullScreen();
	} else if (doc.msExitFullscreen) {
		doc.msExitFullscreen();
	}
}
