---
title: 0.2.0 toolchain and documentation upgrade
description: Migration notes for Vite Plus, Astro Starlight, and the full dependency upgrade.
lastUpdated: 2026-07-23
---

RAATDF 0.2.0 moves the main application to the unified Vite Plus toolchain and rebuilds the `doc` package as an Astro Starlight documentation site. This page covers version, command, structure, and compatibility changes.

## Version changes

| Dependency        | New version | Purpose                                                                    |
| ----------------- | ----------- | -------------------------------------------------------------------------- |
| Vite Plus         | 0.2.6       | Unified development, build, formatting, lint, and static-check entry point |
| Vite              | 8.1.5       | Provided by Vite Plus Core                                                 |
| React             | 19.2.8      | Main application runtime                                                   |
| Ant Design        | 6.5.1       | Main application UI library                                                |
| ProComponents     | 3.1.14-4    | The 3.x prerelease line compatible with Ant Design 6                       |
| Tailwind CSS      | 4.3.3       | Main application styling system                                            |
| TypeScript        | 7.0.2       | Main application type checking                                             |
| Astro             | 7.1.3       | Documentation build framework                                              |
| Starlight         | 0.41.4      | Astro’s official documentation integration                                 |
| TypeScript (docs) | 6.0.3       | Latest version currently supported by `@astrojs/check`                     |

All other runtime dependencies were also upgraded to their latest compatible releases. The root project and the `doc` package maintain separate Bun lockfiles.

## Vite Plus toolchain

Use these commands in the root project:

```bash
bun install
bun run dev
bun run check
bun run check:fix
bun run test
bun run build
bun run preview
```

Bun manages dependencies and runs scripts. Every check, lint, and format script delegates to Vite Plus, with Oxfmt, Oxlint, and TypeScript configured in the root `vite.config.ts`.

Astro handles development and builds for the documentation site, while Vite Plus continues to handle code quality:

```bash
cd doc
bun install
bun run dev
bun run check
bun run build
bun run preview
```

## React Compiler integration

`@vitejs/plugin-react` 6 no longer supports the previous `babel` option. The project now uses the official `reactCompilerPreset` with `@rolldown/plugin-babel`:

```ts
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';

plugins: [react(), babel({ presets: [reactCompilerPreset()] })];
```

## ProComponents 3.x migration

`@ant-design/pro-components` is upgraded directly and pinned to `3.1.14-4`; version 2.x is not kept alongside it. Because the npm `latest` tag may still resolve to 2.x, dependency updates must preserve this exact version or explicitly select the 3.x beta release line.

| 2.x property            | 3.x property                     |
| ----------------------- | -------------------------------- |
| `ProCard bordered`      | `ProCard variant="outlined"`     |
| `ProCard bodyStyle`     | `ProCard styles={{ body: ... }}` |
| `Drawer destroyOnClose` | `Drawer destroyOnHidden`         |
| `Spin tip`              | `Spin description`               |

Package overrides pin `postcss` to 8.5.22 and `picomatch` to 4.0.5. Root and documentation audits must report zero vulnerabilities.

## Admin architecture fixes

- Authentication uses `initializing`, `anonymous`, and `authenticated` states and commits only after profile and menu loading succeeds.
- `rememberMe` selects local or session storage, while a 401 clears user, menu, tab, and cache state consistently.
- The menu store is the sole source for dynamic routes and page permissions, removing the transient 404 after login.
- Tab mutations return the final active path so context actions and Router navigation stay synchronized.
- React 19.2 `Activity` replaces cached React elements; hidden pages retain state and stop effects, while the documentation iframe opts out of caching.
- Persisted settings now include versioned migration and structural validation.

## Documentation migration

The old documentation site rendered Markdown with Vite, `marked`, `highlight.js`, and custom DOM code. After this migration:

- Documentation content lives in `doc/src/content/docs/`.
- Chinese uses root routes, while English uses the `/en/` prefix.
- Starlight provides navigation, a table of contents, full-text search, code highlighting, dark mode, and language switching.
- Astro content collections validate Markdown frontmatter and generate routes.
- `marked`, `highlight.js`, the Tailwind documentation layer, and the custom renderer have been removed.

### Route changes

| Previous URL                 | New URL       |
| ---------------------------- | ------------- |
| `/?lang=zh_CN&doc=guide`     | `/guide/`     |
| `/?lang=en_US&doc=guide`     | `/en/guide/`  |
| `/?lang=zh_CN&doc=changelog` | `/changelog/` |
| `/?lang=en_US&doc=faq`       | `/en/faq/`    |

## Runtime requirements

- Main-application-only development can use any Node.js release supported by Vite Plus.
- Building the Astro 7 documentation site requires Node.js ^22.18.0 or >= 24.11.0.
- CI uses Node.js 24 and installs Vite Plus and Bun through `voidzero-dev/setup-vp@v1`.

## Environment and documentation deployment

| Variable            | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `VITE_API_MODE`     | May be `mock` in development; production requires `remote`                    |
| `VITE_API_BASE_URL` | Required remote API base URL                                                  |
| `VITE_DOCS_URL`     | Production embedded documentation URL, defaulting to `https://doc.raatdf.com` |

Development always embeds `http://localhost:4321` and ignores `VITE_DOCS_URL`. The Astro development server uses strict port mode so a conflict cannot silently move the documentation site.

For Cloudflare Pages, set the project root to `doc`, the build command to `bun run build`, and the output directory to `dist`. No Cloudflare credentials are stored in the repository.

## CI and verification

CI installs root and documentation dependencies separately, then runs:

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

Tests run through Vite Plus Vitest, Testing Library, and Happy DOM. Both projects must pass formatting, lint, type checks, tests, security audits, and production builds after migration.
