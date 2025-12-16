# Package manager?

**Bun** is recommended, it's faster than npm/yarn.

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

# Node.js version?

Minimum Node.js 18.0, recommended 20+.

# Path alias?

Use `@/` to point to `src/` directory:

```tsx
import { useSystemStore } from '@/store';
```

# Theme switching?

Use CSS variables:

```tsx
// Recommended
<div style={{ color: 'var(--ant-color-primary)' }}>

// Avoid hardcoding
<div className="text-blue-500">
```

# Using icons?

Use RemixIcon:

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

Icon lookup: [remixicon.com](https://remixicon.com/)

# Ant Design variables in Tailwind?

Tailwind CSS v4 supports CSS variables directly:

```tsx
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

# Get locale text?

```tsx
import { useSystemStore } from '@/store';
import { getDashboardLocale } from '@/locales';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

# Add new language?

1. Add type in `src/types/locale.ts`
2. Add translations in each locale file
3. Add option in language switch component

# Change system name?

Modify `system.name` in `src/locales/system/` for the corresponding language file.

# Hide settings?

Modify `FEATURE_FLAGS` in `src/config/system.ts`:

```ts
export const FEATURE_FLAGS = {
  tabs: false,      // Hide tabs setting
  compactMode: false, // Hide compact mode setting
  // ...
};
```

# Change default layout?

Modify `SYSTEM_DEFAULTS` in `src/config/system.ts`:

```ts
export const SYSTEM_DEFAULTS = {
  layout: {
    menuLayout: 'horizontal', // Change to top bar layout
    // ...
  },
};
```

# Customize account menu?

Modify `src/layouts/account-menu-items.tsx` to configure account dropdown items.

# Add header buttons?

Modify `src/layouts/toolbar-buttons.tsx` to configure header function buttons.

# Build fails?

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
bun install
bun build
```

# Code check errors?

```bash
# Auto-fix
bun check:fix
```
