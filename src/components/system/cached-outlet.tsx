import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { PageTransitionType, useSystemStore } from '@/store';

/**
 * 根据动画类型获取对应的 CSS 类名
 */
const getAnimationClass = (type: PageTransitionType): string => {
	switch (type) {
		case PageTransitionType.FADE:
			return 'page-transition-fade';
		case PageTransitionType.SLIDE_LEFT:
			return 'page-transition-slide-left';
		case PageTransitionType.SLIDE_UP:
			return 'page-transition-slide-up';
		case PageTransitionType.SLIDE_DOWN:
			return 'page-transition-slide-down';
		case PageTransitionType.SCALE:
			return 'page-transition-scale';
		default:
			return '';
	}
};

/**
 * 缓存 Outlet 组件
 * 根据缓存设置决定是否保留页面状态
 * 通过 DOM 操作触发页面切换动画，避免因 key 变化导致缓存失效
 */
const CachedOutlet = () => {
	const location = useLocation();
	const { enablePageCache, showTabs, cachedPages, addPageToCache, enablePageTransition, pageTransitionType } =
		useSystemStore();
	const outlet = useOutlet();

	// 使用 ref 存储每个路径对应的组件实例
	const cacheNodes = useRef<Map<string, React.ReactElement>>(new Map());

	// 存储每个页面容器的 DOM 引用，用于触发动画
	const containerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

	// 记录上一次的路径，用于判断是否需要触发动画
	const prevPathnameRef = useRef<string>('');

	// 如果当前路径有 outlet 内容，缓存它
	if (outlet) {
		cacheNodes.current.set(location.pathname, outlet);
	}

	// 构建需要渲染的页面列表（当前页面 + 缓存列表）
	const pagesToRender = useMemo(() => {
		const pages = new Set<string>();
		pages.add(location.pathname); // 当前页面
		for (const item of cachedPages) {
			pages.add(item.path); // 缓存列表
		}
		return Array.from(pages);
	}, [location.pathname, cachedPages]);

	// 添加当前页面到缓存
	useEffect(() => {
		if (enablePageCache && showTabs) {
			addPageToCache(location.pathname);
		}
	}, [location.pathname, enablePageCache, showTabs, addPageToCache]);

	// 清理不再需要缓存的节点
	useEffect(() => {
		const currentPaths = new Set(pagesToRender);
		const cachedPaths = Array.from(cacheNodes.current.keys());

		for (const path of cachedPaths) {
			if (!currentPaths.has(path)) {
				cacheNodes.current.delete(path);
				containerRefs.current.delete(path);
			}
		}
	}, [pagesToRender]);

	// 切换页面时，通过 DOM 操作强制重新触发动画
	useEffect(() => {
		if (!enablePageTransition || pageTransitionType === PageTransitionType.NONE) {
			prevPathnameRef.current = location.pathname;
			return;
		}

		if (prevPathnameRef.current !== location.pathname) {
			prevPathnameRef.current = location.pathname;

			const container = containerRefs.current.get(location.pathname);
			if (container) {
				const animClass = getAnimationClass(pageTransitionType);
				if (animClass) {
					// 移除动画类 → 强制重排 → 重新添加，触发动画
					container.classList.remove(animClass);
					void container.offsetWidth;
					container.classList.add(animClass);
				}
			}
		}
	}, [location.pathname, enablePageTransition, pageTransitionType]);

	// 获取当前应该使用的动画类名
	const animationClass =
		enablePageTransition && pageTransitionType !== PageTransitionType.NONE ? getAnimationClass(pageTransitionType) : '';

	// 动画容器样式
	const animationStyle: React.CSSProperties = animationClass
		? {
				willChange: 'opacity, transform',
				backfaceVisibility: 'hidden',
			}
		: {};

	// 未启用缓存或未启用多标签页，使用简单的渲染方式
	// 使用 location.key 作为 key，每次路由变化都会创建新的 div，触发动画
	if (!enablePageCache || !showTabs) {
		return (
			<div key={location.key} className={animationClass} style={animationStyle}>
				{outlet}
			</div>
		);
	}

	// 缓存模式：渲染所有缓存的页面，通过 display 控制显示
	// 动画通过 DOM 操作触发，避免因 key 变化导致缓存失效
	return (
		<>
			{pagesToRender.map((pagePath) => {
				const isActive = location.pathname === pagePath;
				const cachedNode = cacheNodes.current.get(pagePath);

				if (!cachedNode) {
					return null;
				}

				return (
					<div
						key={pagePath}
						ref={(el) => {
							containerRefs.current.set(pagePath, el);
						}}
						className={isActive ? animationClass : ''}
						style={{
							display: isActive ? 'block' : 'none',
							height: '100%',
							width: '100%',
							...(isActive ? animationStyle : {}),
						}}
					>
						{cachedNode}
					</div>
				);
			})}
		</>
	);
};

export default CachedOutlet;
