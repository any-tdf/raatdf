import { Activity, Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, type Location, useLocation } from 'react-router-dom';

import type { MenuItem } from '@/api/mocks/menu';
import ErrorBoundary from '@/components/system/error-boundary';
import { getCommonLocale } from '@/locales';
import Forbidden from '@/pages/errors/403';
import NotFound from '@/pages/errors/404';
import ServerError from '@/pages/errors/500';
import { generateComponentMap } from '@/router/auto-routes';
import { PageTransitionType, useMenuStore, useSystemStore } from '@/store';
import { findMenuItemByPath } from '@/utils/permissions';

const componentMap: Record<string, React.ComponentType> = {
	...generateComponentMap(),
	Forbidden,
	NotFound,
	ServerError,
};

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

const getFirstPath = (items: MenuItem[]): string => {
	for (const item of items) {
		if (item.path) return item.path;
		if (item.children?.length) {
			const path = getFirstPath(item.children);
			if (path) return path;
		}
	}
	return '/403';
};

const generateRoutes = (items: MenuItem[], loadingText: string): React.ReactElement[] =>
	items.flatMap((item) => {
		const routes = item.children?.length ? generateRoutes(item.children, loadingText) : [];
		const Component = item.component ? componentMap[item.component] : undefined;
		if (item.path && Component) {
			routes.push(
				<Route
					key={item.key}
					path={item.path}
					element={
						<ErrorBoundary>
							<Suspense fallback={<div className="p-6">{loadingText}</div>}>
								<Component />
							</Suspense>
						</ErrorBoundary>
					}
				/>
			);
		}
		return routes;
	});

interface PageRoutesProps {
	location: Location;
	menuData: MenuItem[];
	loadingText: string;
}

const PageRoutes = ({ location, menuData, loadingText }: PageRoutesProps) => (
	<Routes location={location}>
		{generateRoutes(menuData, loadingText)}
		<Route path="/403" element={<Forbidden />} />
		<Route path="/404" element={<NotFound />} />
		<Route path="/500" element={<ServerError />} />
		<Route path="/" element={<Navigate to={getFirstPath(menuData)} replace />} />
		<Route path="*" element={<NotFound />} />
	</Routes>
);

const CachedOutlet = () => {
	const location = useLocation();
	const menuData = useMenuStore((state) => state.menuData);
	const {
		enablePageCache,
		showTabs,
		cachedPages,
		addPageToCache,
		removePageFromCache,
		enablePageTransition,
		pageTransitionType,
		locale,
	} = useSystemStore();
	const [cachedLocations, setCachedLocations] = useState<Record<string, Location>>({});
	const currentMenuItem = findMenuItemByPath(menuData, location.pathname);
	const canCacheCurrentPage = currentMenuItem?.cache !== false && !!currentMenuItem;
	const loadingText = getCommonLocale(locale).loading.loadingPage;

	useEffect(() => {
		if (enablePageCache && showTabs && canCacheCurrentPage) {
			addPageToCache(location.pathname);
			setCachedLocations((current) => ({ ...current, [location.pathname]: location }));
		} else {
			removePageFromCache(location.pathname);
			setCachedLocations((current) => {
				const next = { ...current };
				delete next[location.pathname];
				return next;
			});
		}
	}, [
		addPageToCache,
		canCacheCurrentPage,
		enablePageCache,
		location,
		location.pathname,
		removePageFromCache,
		showTabs,
	]);

	useEffect(() => {
		const validPaths = new Set(cachedPages.map((item) => item.path));
		setCachedLocations((current) =>
			Object.fromEntries(Object.entries(current).filter(([path]) => validPaths.has(path)))
		);
	}, [cachedPages]);

	const pagesToRender = useMemo(() => {
		const paths = new Set<string>([location.pathname]);
		if (enablePageCache && showTabs) {
			for (const item of cachedPages) {
				if (findMenuItemByPath(menuData, item.path)?.cache !== false) paths.add(item.path);
			}
		}
		return [...paths];
	}, [cachedPages, enablePageCache, location.pathname, menuData, showTabs]);

	const animationClass =
		enablePageTransition && pageTransitionType !== PageTransitionType.NONE ? getAnimationClass(pageTransitionType) : '';

	if (!enablePageCache || !showTabs) {
		return (
			<div key={location.key} className={`h-full min-h-0 ${animationClass}`}>
				<PageRoutes location={location} menuData={menuData} loadingText={loadingText} />
			</div>
		);
	}

	return pagesToRender.map((path) => {
		const isActive = path === location.pathname;
		const pageLocation = isActive ? location : cachedLocations[path];
		if (!pageLocation) return null;

		return (
			<Activity key={path} mode={isActive ? 'visible' : 'hidden'}>
				<div className={`h-full min-h-0 ${isActive ? animationClass : ''}`} data-cached-path={path}>
					<PageRoutes location={pageLocation} menuData={menuData} loadingText={loadingText} />
				</div>
			</Activity>
		);
	});
};

export default CachedOutlet;
