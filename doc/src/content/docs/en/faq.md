---
title: Frequently Asked Questions
description: Common questions about RAATDF environments, tooling, themes, localization, and builds.
lastUpdated: 2026-07-23
---

## Which package manager should I use?

The project uses **Bun** for dependency management and Vite Plus for development, builds, formatting, and linting. The `devEngines` entry pins Bun 1.3.14.

```bash
# Install Vite Plus
curl -fsSL https://vite.plus | bash

# Install project dependencies
bun install
```

## Which Node.js versions are supported?

You can use any Node.js version supported by Vite Plus when developing only the main application. The complete repository also includes an Astro 7 documentation site, so Node.js ^22.18.0 or >= 24.11.0 is recommended for all workflows.

## Why does the documentation site use TypeScript 6?

The main application uses TypeScript 7.0.2. The documentation site pins TypeScript 6.0.3 because it is the newest release currently compatible with `@astrojs/check` 0.9.9. The two projects install dependencies independently and maintain separate lockfiles.

## How do I run the documentation site?

```bash
cd doc
bun install
bun run dev
```

Run `bun run check` for Astro type checks, Oxfmt formatting checks, and Oxlint linting. Run `bun run build` for a production build.

## How do path aliases work?

Use `@/` to point to the `src/` directory:

```tsx
import { useSystemStore } from '@/store';
```

## How do I switch themes?

Use Ant Design CSS variables:

```tsx
// Recommended
<div style={{ color: 'var(--ant-color-primary)' }}>

// Avoid hardcoding
<div className="text-blue-500">
```

## How do I use icons?

The project uses RemixIcon:

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

Browse the full icon set on [RemixIcon](https://remixicon.com/).

## How do I use Ant Design variables in Tailwind CSS?

Tailwind CSS v4 supports CSS variables directly:

```tsx
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

## How do I retrieve localized text?

```tsx
import { getDashboardLocale } from '@/locales';
import { useSystemStore } from '@/store';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

## How do I add a language?

1. Add the type in `src/types/locale.ts`.
2. Add translations to each locale file.
3. Add an option to the language switcher.

## How do I change the system name?

Update `system.name` in the corresponding language file under `src/locales/system/`.

## How do I hide settings?

Update `FEATURE_FLAGS` in `src/config/system.ts`:

```ts
export const FEATURE_FLAGS = {
	tabs: false, // Hide tabs setting
	compactMode: false, // Hide compact mode setting
	// ...
};
```

## How do I change the default layout?

Update `SYSTEM_DEFAULTS` in `src/config/system.ts`:

```ts
export const SYSTEM_DEFAULTS = {
	layout: {
		menuLayout: 'horizontal', // Use the top navigation layout
		// ...
	},
};
```

## How do I customize the account menu?

Update `src/layouts/account-menu-items.tsx` to configure account dropdown items.

## How do I add header buttons?

Update `src/layouts/toolbar-buttons.tsx` to configure header actions.

## How do I troubleshoot a failed build?

Run the full check first, then clear the Vite Plus task cache and reinstall dependencies:

```bash
bun run check
vp cache clean
bun install
bun run build
```

Run the corresponding tasks from the `doc` directory for the documentation site:

```bash
cd doc
bun run check
bun run build
```

## How do I automatically fix code-quality errors?

```bash
bun run check:fix
```

Use `bun run check:fix` for the documentation site.
