---
title: 更新日志
description: RAATDF 的版本与重要变更记录。
lastUpdated: 2026-07-23
---

本日志格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循[语义化版本](https://semver.org/lang/zh-CN/)。

## 0.2.0 - 2026-07-23

### 变更

- 将主应用的全部依赖升级到 2026-07-23 的最新兼容版本。
- 将开发、构建、依赖管理、格式化、lint 和类型检查入口统一为 Vite Plus 0.2.6。
- 使用 Oxfmt 和 Oxlint 替代 Biome，并将配置集中到 `vite.config.ts`。
- 升级至 React 19.2.8、Ant Design 6.5.1、Tailwind CSS 4.3.3、TypeScript 7.0.2 与 Vite 8.1.5。
- 将 `@ant-design/pro-components` 直接升级并固定为 3.1.14-4，完成 ProCard 与 Drawer 的破坏性属性迁移。
- 适配 `@vitejs/plugin-react` 6 与新的 React Compiler 集成方式。
- 使用 React 19.2 `Activity` 重构多标签页缓存，使隐藏页面停止 Effect 并保留界面状态。
- 重构认证三态、401 清理、`rememberMe` 存储、动态菜单注册与页面权限守卫。
- 修复标签页右键操作与路由不同步、固定标签被删除、无效嵌套按钮和文档 iframe 无失败反馈等问题。
- 清理 Ant Design 6 的 Spin、Drawer、Alert 与 List 弃用用法，并将通知操作改为语义化按钮。
- 拆分系统默认值、设置 Hook 与工具栏本地化配置，消除 Store 与配置模块的循环依赖及开发环境 HMR 初始化错误。
- 增加 Vite Plus Vitest、Testing Library 与 Happy DOM 测试，覆盖认证、权限、标签页、缓存和文档加载。
- 覆盖存在漏洞的 `postcss` 与 `picomatch` 传递依赖，安全审计目标调整为 0 个漏洞。
- 将 `doc` 重建为 Astro 7.1.3 与 Starlight 0.41.4 文档站，提供中英文路由、侧栏、搜索、页内目录、暗色模式和代码高亮。
- 将 CI 更新为 Node.js 24 与 `voidzero-dev/setup-vp@v1`，分别检查和构建主应用与文档站。

### 移除

- 移除 Biome 配置和品牌资源。
- 移除文档站旧有的 Vite、`marked`、`highlight.js`、Tailwind 样式层与自定义 DOM 渲染器。
- 移除仓库中的 TypeScript 增量构建缓存。

### 验证

- 主应用通过 `bun run check`、`bun run test` 与 `bun run build`。
- 文档站通过 `bun run check` 与 `bun run build`。
- 主应用新增 20 个自动化测试，CI 同时执行根项目和文档项目的 `bun audit`。

完整的兼容性、命令和路由变化请参阅[升级说明](/upgrade/)。
