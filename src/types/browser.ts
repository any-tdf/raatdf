/**
 * 浏览器兼容性类型定义
 * 扩展标准 DOM 接口以支持各浏览器的全屏 API
 */

// 扩展 Document 接口以支持浏览器前缀的全屏方法
interface DocumentWithFullscreen extends Document {
	webkitExitFullscreen?: () => Promise<void>;
	mozCancelFullScreen?: () => Promise<void>;
	msExitFullscreen?: () => Promise<void>;
}

// 扩展 HTMLElement 接口以支持浏览器前缀的全屏请求方法
interface HTMLElementWithFullscreen extends HTMLElement {
	webkitRequestFullscreen?: () => Promise<void>;
	mozRequestFullScreen?: () => Promise<void>;
	msRequestFullscreen?: () => Promise<void>;
}

export type { DocumentWithFullscreen, HTMLElementWithFullscreen };
