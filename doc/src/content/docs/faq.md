---
title: 常见问题
description: RAATDF 的环境、工具链、主题、国际化与构建常见问题。
lastUpdated: 2026-07-23
---

## 推荐使用哪个包管理器？

项目统一使用 **Bun** 管理依赖，通过 Vite Plus 执行开发、构建、格式化与 lint。`package.json` 中的 `devEngines` 固定使用 Bun 1.3.14。

```bash
# 安装 Vite Plus
curl -fsSL https://vite.plus | bash

# 安装项目依赖
bun install
```

## Node.js 版本要求是什么？

只开发主应用时，可以使用 Vite Plus 支持的 Node.js 版本。完整安装还包含 Astro 7 文档站，因此推荐统一使用 Node.js ^22.18.0 或 >= 24.11.0。

## 为什么文档站使用 TypeScript 6？

主应用使用 TypeScript 7.0.2。文档站将 TypeScript 固定在 6.0.3，因为这是 `@astrojs/check` 0.9.9 当前支持的最新兼容版本。两个项目独立安装依赖并维护锁文件，不会互相覆盖。

## 如何运行文档站？

```bash
cd doc
bun install
bun run dev
```

使用 `bun run check` 完成 Astro 类型检查、Oxfmt 格式检查和 Oxlint lint，使用 `bun run build` 构建生产版本。

## 路径别名如何使用？

使用 `@/` 指向 `src/` 目录：

```tsx
import { useSystemStore } from '@/store';
```

## 如何切换主题？

使用 Ant Design CSS 变量：

```tsx
// 推荐
<div style={{ color: 'var(--ant-color-primary)' }}>

// 避免硬编码
<div className="text-blue-500">
```

## 如何使用图标？

项目使用 RemixIcon：

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

可以在 [RemixIcon](https://remixicon.com/) 查询完整图标列表。

## 如何在 Tailwind CSS 中使用 Ant Design 变量？

Tailwind CSS v4 支持直接使用 CSS 变量：

```tsx
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

## 如何获取语言文案？

```tsx
import { getDashboardLocale } from '@/locales';
import { useSystemStore } from '@/store';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

## 如何添加新语言？

1. 在 `src/types/locale.ts` 中添加类型。
2. 在各个 Locale 文件中添加翻译。
3. 在语言切换组件中添加选项。

## 如何修改系统名称？

修改 `src/locales/system/` 中对应语言文件的 `system.name`。

## 如何隐藏设置项？

在 `src/config/system.ts` 中修改 `FEATURE_FLAGS`：

```ts
export const FEATURE_FLAGS = {
	tabs: false, // 隐藏多标签页设置
	compactMode: false, // 隐藏紧凑模式设置
	// ...
};
```

## 如何修改默认布局？

在 `src/config/system.ts` 中修改 `SYSTEM_DEFAULTS`：

```ts
export const SYSTEM_DEFAULTS = {
	layout: {
		menuLayout: 'horizontal', // 改为顶栏布局
		// ...
	},
};
```

## 如何自定义账号菜单？

修改 `src/layouts/account-menu-items.tsx`，配置账号下拉菜单项。

## 如何添加顶栏按钮？

修改 `src/layouts/toolbar-buttons.tsx`，配置顶栏功能按钮。

## 构建失败时如何排查？

先运行完整检查，再清理 Vite Plus 任务缓存并重新安装依赖：

```bash
bun run check
vp cache clean
bun install
bun run build
```

文档站需要在 `doc` 目录运行对应任务：

```bash
cd doc
bun run check
bun run build
```

## 代码检查报错时如何自动修复？

```bash
bun run check:fix
```

文档站使用 `bun run check:fix`。
