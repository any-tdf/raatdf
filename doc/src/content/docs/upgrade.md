---
title: 0.2.0 工具链与文档站升级
description: Vite Plus、Astro Starlight 与全量依赖升级的迁移说明。
lastUpdated: 2026-07-23
---

RAATDF 0.2.0 将主应用迁移到 Vite Plus 统一工具链，并将 `doc` 子项目重建为 Astro Starlight 文档站。以下内容说明版本、命令、目录和兼容性变化。

## 版本变化

| 依赖                 | 升级后版本 | 说明                                        |
| -------------------- | ---------- | ------------------------------------------- |
| Vite Plus            | 0.2.6      | 统一开发、构建、格式化、lint 与静态检查入口 |
| Vite                 | 8.1.5      | 由 Vite Plus Core 提供                      |
| React                | 19.2.8     | 主应用运行时                                |
| Ant Design           | 6.5.1      | 主应用 UI 组件库                            |
| ProComponents        | 3.1.14-4   | Ant Design 6 对应的 3.x 预发布版本          |
| Tailwind CSS         | 4.3.3      | 主应用样式系统                              |
| TypeScript           | 7.0.2      | 主应用类型检查                              |
| Astro                | 7.1.3      | 文档站构建框架                              |
| Starlight            | 0.41.4     | Astro 官方文档站集成                        |
| TypeScript（文档站） | 6.0.3      | `@astrojs/check` 当前支持的最新兼容版本     |

其余运行时依赖也已升级到当前最新兼容版本，根项目与 `doc` 子项目分别维护 Bun 锁文件。

## Vite Plus 工具链

根项目使用以下命令：

```bash
bun install
bun run dev
bun run check
bun run check:fix
bun run test
bun run build
bun run preview
```

项目使用 Bun 管理依赖和执行脚本。`check`、`lint` 与 `format` 脚本全部委托给 Vite Plus，由 Oxfmt、Oxlint 与 TypeScript 完成检查，配置集中在根目录的 `vite.config.ts`。

文档站由 Astro 负责开发与构建，但代码质量仍由 Vite Plus 负责：

```bash
cd doc
bun install
bun run dev
bun run check
bun run build
bun run preview
```

## React Compiler 适配

`@vitejs/plugin-react` 6 不再使用旧的 `babel` 选项。项目改用官方提供的 `reactCompilerPreset`，并通过 `@rolldown/plugin-babel` 加载 React Compiler：

```ts
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';

plugins: [react(), babel({ presets: [reactCompilerPreset()] })];
```

## ProComponents 3.x 迁移

`@ant-design/pro-components` 直接升级并固定为 `3.1.14-4`，不与 2.x 共存。npm 的 `latest` 标签仍可能指向 2.x，因此更新依赖时必须保留该精确版本，或显式使用 3.x 的 beta 发布线。

主要属性迁移如下：

| 2.x 属性                | 3.x 属性                         |
| ----------------------- | -------------------------------- |
| `ProCard bordered`      | `ProCard variant="outlined"`     |
| `ProCard bodyStyle`     | `ProCard styles={{ body: ... }}` |
| `Drawer destroyOnClose` | `Drawer destroyOnHidden`         |
| `Spin tip`              | `Spin description`               |

同时使用 `overrides` 将 `postcss` 固定为 8.5.22、`picomatch` 固定为 4.0.5，升级后的根项目和文档项目安全审计均要求为 0 个漏洞。

## 管理端架构修复

- 认证状态统一为 `initializing`、`anonymous` 与 `authenticated`，用户资料和菜单成功后才提交登录状态。
- `rememberMe` 决定使用 `localStorage` 或 `sessionStorage`，401 会统一清理用户、菜单、标签页与缓存。
- 菜单 Store 是动态路由和权限判断的唯一来源，修复登录后短暂 404 以及直接访问越权页面的问题。
- 标签操作返回最终活动路径，右键关闭操作与 Router 保持同步，并保护固定标签。
- 页面缓存改用 React 19.2 `Activity`；隐藏页面保留状态、停止 Effect，文档 iframe 明确禁用缓存。
- 持久化设置增加版本、迁移和结构校验，损坏或旧版认证、菜单与标签数据不会继续恢复。

## 文档站迁移

旧文档站通过 Vite、`marked`、`highlight.js` 与自定义 DOM 代码渲染 Markdown。本次迁移后：

- 文档内容位于 `doc/src/content/docs/`。
- 中文使用根路径，英文使用 `/en/` 前缀。
- Starlight 提供侧栏、页内目录、全文搜索、代码高亮、暗色模式和多语言切换。
- Astro 内容集合负责 Markdown frontmatter 校验与路由生成。
- `marked`、`highlight.js`、Tailwind 文档样式和旧的自定义渲染器已移除。

### 路由变化

| 旧地址                       | 新地址        |
| ---------------------------- | ------------- |
| `/?lang=zh_CN&doc=guide`     | `/guide/`     |
| `/?lang=en_US&doc=guide`     | `/en/guide/`  |
| `/?lang=zh_CN&doc=changelog` | `/changelog/` |
| `/?lang=en_US&doc=faq`       | `/en/faq/`    |

## 运行环境

- 只开发主应用时，可使用 Vite Plus 支持的 Node.js 版本。
- 同时构建 Astro 7 文档站时，请使用 Node.js ^22.18.0 或 >= 24.11.0。
- CI 使用 Node.js 24，并通过 `voidzero-dev/setup-vp@v1` 安装 Vite Plus 与 Bun。

## 环境变量与文档部署

| 变量                | 说明                                                |
| ------------------- | --------------------------------------------------- |
| `VITE_API_MODE`     | 开发环境可设为 `mock`，生产环境必须使用 `remote`    |
| `VITE_API_BASE_URL` | 远程 API 基础地址，生产环境必填                     |
| `VITE_DOCS_URL`     | 生产环境内嵌文档地址，默认 `https://doc.raatdf.com` |

开发模式固定内嵌 `http://localhost:4321`，并忽略 `VITE_DOCS_URL`。Astro 开发服务器启用严格端口模式，避免端口冲突后自动切换地址。

Cloudflare Pages 部署文档站时，项目根目录设置为 `doc`，构建命令使用 `bun run build`，输出目录设置为 `dist`。仓库不保存 Cloudflare 凭据。

## CI 与验证

CI 会分别安装根项目和文档站依赖，然后运行：

```bash
bun run check
bun run test
bun run build
bun audit

cd doc
bun run check
bun run build
bun audit
```

测试由 Vite Plus 内置 Vitest、Testing Library 与 Happy DOM 执行。迁移完成后，根项目和文档站均需通过格式检查、lint、类型检查、测试、安全审计与生产构建。
