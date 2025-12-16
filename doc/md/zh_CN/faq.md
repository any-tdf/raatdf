# 推荐的包管理器？

推荐使用 **Bun**，比 npm/yarn 更快。

```bash
# 安装 Bun
curl -fsSL https://bun.sh/install | bash

# 安装依赖
bun install
```

# Node.js 版本要求？

最低 Node.js 18.0，推荐 20+。

# 路径别名？

使用 `@/` 指向 `src/` 目录：

```tsx
import { useSystemStore } from '@/store';
```

# 主题切换？

使用 CSS 变量：

```tsx
// 推荐
<div style={{ color: 'var(--ant-color-primary)' }}>

// 避免硬编码
<div className="text-blue-500">
```

# 使用图标？

使用 RemixIcon：

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

图标查询：[remixicon.com](https://remixicon.com/)

# Tailwind 使用 Ant Design 变量？

Tailwind CSS v4 支持直接使用 CSS 变量：

```tsx
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

# 获取语言文案？

```tsx
import { useSystemStore } from '@/store';
import { getDashboardLocale } from '@/locales';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

# 添加新语言？

1. 在 `src/types/locale.ts` 添加类型
2. 在各 locale 文件添加翻译
3. 在语言切换组件添加选项

# 修改系统名称？

修改 `src/locales/system/` 目录下对应语言文件中的 `system.name`。

# 隐藏设置项？

在 `src/config/system.ts` 中修改 `FEATURE_FLAGS`：

```ts
export const FEATURE_FLAGS = {
  tabs: false,      // 隐藏多标签页设置
  compactMode: false, // 隐藏紧凑模式设置
  // ...
};
```

# 修改默认布局？

在 `src/config/system.ts` 中修改 `SYSTEM_DEFAULTS`：

```ts
export const SYSTEM_DEFAULTS = {
  layout: {
    menuLayout: 'horizontal', // 改为顶栏布局
    // ...
  },
};
```

# 自定义账号菜单？

修改 `src/layouts/account-menu-items.tsx` 配置账号下拉菜单项。

# 添加顶栏按钮？

修改 `src/layouts/toolbar-buttons.tsx` 配置顶栏功能按钮。

# 构建失败？

```bash
# 清除缓存重新构建
rm -rf node_modules dist .vite
bun install
bun build
```

# 代码检查报错？

```bash
# 自动修复
bun check:fix
```
