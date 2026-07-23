---
title: Changelog
description: RAATDF release history and notable changes.
lastUpdated: 2026-07-23
---

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## 0.2.0 - 2026-07-23

### Changed

- Upgraded all main-application dependencies to their latest compatible releases as of 2026-07-23.
- Standardized development, builds, dependency management, formatting, linting, and type checks on Vite Plus 0.2.6.
- Replaced Biome with Oxfmt and Oxlint, with configuration centralized in `vite.config.ts`.
- Upgraded to React 19.2.8, Ant Design 6.5.1, Tailwind CSS 4.3.3, TypeScript 7.0.2, and Vite 8.1.5.
- Upgraded and pinned `@ant-design/pro-components` to 3.1.14-4, including the ProCard and Drawer breaking-property migrations.
- Adapted the React Compiler integration for `@vitejs/plugin-react` 6.
- Replaced manual page-element caching with React 19.2 `Activity`, preserving page state while stopping hidden effects.
- Added atomic authentication states, consistent 401 cleanup, `rememberMe` storage, a single menu route source, and real page guards.
- Fixed tab and Router desynchronization, pinned-tab removal, invalid nested buttons, and missing iframe failure feedback.
- Removed deprecated Ant Design 6 Spin, Drawer, Alert, and List usage, and converted notification actions to semantic buttons.
- Split system defaults, the settings hook, and toolbar locale data to remove Store/configuration cycles and development HMR initialization failures.
- Added Vite Plus Vitest, Testing Library, and Happy DOM coverage for authentication, permissions, tabs, caching, and documentation loading.
- Pinned secure transitive versions of `postcss` and `picomatch`, with zero-vulnerability audits required in CI.
- Rebuilt `doc` with Astro 7.1.3 and Starlight 0.41.4, adding localized routes, navigation, search, tables of contents, dark mode, and code highlighting.
- Updated CI to Node.js 24 and `voidzero-dev/setup-vp@v1`, with separate checks and builds for the application and documentation site.

### Removed

- Removed the Biome configuration and branding asset.
- Removed the documentation site's previous Vite, `marked`, `highlight.js`, Tailwind style layer, and custom DOM renderer.
- Removed the committed TypeScript incremental-build cache.

### Verified

- The main application passes `bun run check`, `bun run test`, and `bun run build`.
- The documentation site passes `bun run check` and `bun run build`.
- The main application includes 20 automated tests, and CI audits both lockfiles.

See the [upgrade notes](/en/upgrade/) for complete compatibility, command, and route changes.
