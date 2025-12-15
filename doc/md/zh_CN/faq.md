# 常见问题

## 环境配置

### Q: 使用什么包管理器？

使用 **Bun**，比 npm/yarn 更快。

```bash
# 安装 Bun
curl -fsSL https://bun.sh/install | bash

# 安装依赖
bun install
```

### Q: Node.js 版本要求？

最低 Node.js 18.0，推荐 20+。

---

## 开发问题

### Q: 如何修改默认端口？

修改 `vite.config.ts`：

```ts
server: {
  port: 3000,
}
```

### Q: 导入路径别名是什么？

使用 `@/` 指向 `src/` 目录：

```tsx
import { useSystemStore } from '@/store';
```

### Q: 如何添加环境变量？

创建 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:3000
```

代码中使用：

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 样式问题

### Q: 如何支持主题切换？

使用 CSS 变量：

```tsx
// 推荐
<div style={{ color: 'var(--ant-color-primary)' }}>

// 避免硬编码
<div className="text-blue-500">
```

### Q: 如何使用图标？

使用 RemixIcon：

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

图标查询：[remixicon.com](https://remixicon.com/)

### Q: Space 组件报 direction 废弃警告？

使用 `vertical` 属性：

```tsx
// 正确
<Space vertical size="large">

// 废弃
<Space direction="vertical" size="large">
```

---

## 国际化

### Q: 如何获取当前语言的文案？

```tsx
import { useSystemStore } from '@/store';
import { getDashboardLocale } from '@/locales';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

### Q: 如何添加新语言？

1. 在 `src/types/locale.ts` 添加类型
2. 在各 locale 文件添加翻译
3. 在语言切换组件添加选项

---

## 权限问题

### Q: 如何控制菜单权限？

在菜单配置中设置 `roles`：

```ts
{
  key: 'admin',
  path: '/admin',
  roles: ['admin'],
}
```

### Q: 如何保护路由？

```tsx
<Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>
```

---

## 构建问题

### Q: 构建失败怎么办？

```bash
# 清除缓存重新构建
rm -rf node_modules dist .vite
bun install
bun build
```

### Q: 代码检查报错？

```bash
# 自动修复
bun check:fix
```

---

## 其他

### Q: 如何配置代理？

修改 `vite.config.ts`：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://api.example.com',
      changeOrigin: true,
    },
  },
}
```

### Q: 如何修改系统名称？

修改 `src/locales/system/common.ts` 中的 `system.name`。

---

**最后更新:** 2024-12-09
