# I. Getting Started

## 1. Environment Setup

Ensure the following tools are installed:

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (recommended) or npm/yarn/pnpm
- **Git** version control
- **VS Code** (recommended) or other code editors

## 2. Clone the Project

```bash
# Using HTTPS
git clone https://github.com/any-tdf/raatdf.git

# Or using SSH
git clone git@github.com:any-tdf/raatdf.git

# Enter project directory
cd raatdf
```

## 3. Install Dependencies

```bash
# Using Bun (recommended, faster)
bun install

# Or using other package managers
npm install
# yarn install
# pnpm install
```

# II. Project Structure

```
raatdf/
├── public/              # Static assets
├── src/
│   ├── api/            # API definitions
│   │   └── mocks/      # Mock data
│   ├── components/     # Shared components
│   │   └── system/     # System components
│   ├── config/         # Configuration files
│   ├── layouts/        # Layout components
│   ├── locales/        # Internationalization files
│   ├── pages/          # Page components
│   ├── store/          # State management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── app.tsx         # Application entry
│   └── main.tsx        # Main entry file
├── biome.json          # Biome configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

---

# III. Initial Configuration

## 1. System Name

Modify the system name in `src/locales/system/` for each language:

```ts
system: {
  name: 'Your System Name',  // Change to your project name
}
```

## 2. Feature Flags

Control which options appear in the system settings panel via **src/config/system.ts** `FEATURE_FLAGS`:

```ts
export const FEATURE_FLAGS = {
  themeMode: true,        // Theme mode toggle
  primaryColor: true,     // Theme color selection
  menuLayout: true,       // Menu layout
  contentWidth: true,     // Content width
  floatingUI: true,       // Floating UI
  borderRadius: true,     // Border radius
  language: true,         // Language settings
  refreshButton: true,    // Refresh button
  collapseButton: true,   // Collapse button
  headerButtons: true,    // Header buttons
  immersiveMode: true,    // Immersive mode
  cardContainer: true,    // Card container
  compactMode: true,      // Compact mode
  sidebarToolbar: true,   // Sidebar toolbar
  tabs: true,             // Multi-tabs
  tabsStyle: true,        // Tab styles
  pageCache: true,        // Page cache
  pageTransition: true,   // Page transitions
  fullscreen: true,       // Fullscreen mode
};
```

**Usage:**

- Set to `true`: Option appears in settings panel, user can modify
- Set to `false`: Option hidden, uses default value from `SYSTEM_DEFAULTS`
- Setting to `false` doesn't disable the feature, just hides the setting

For example, if your project doesn't need multi-tab settings, change `tabs: true` to `tabs: false`.

## 3. System Defaults

The `SYSTEM_DEFAULTS` object in **src/config/system.ts** contains default values:

```ts
export const SYSTEM_DEFAULTS = {
  theme: {
    themeMode: 'system',      // Theme mode: 'light' | 'dark' | 'system'
    primaryColor: '#1677ff',  // Theme color
  },
  layout: {
    menuLayout: 'vertical',   // Menu layout: 'vertical' | 'horizontal' | 'mixed'
    contentWidth: 'full',     // Content width: 'full' | 'fixed'
    fixedWidthMax: 1200,      // Fixed width max
    enableFloatingUI: true,   // Floating UI
    borderRadius: 8,          // Border radius: 0-24
  },
  // ... more configs
};
```

Modify these defaults according to your project needs.

## 4. Fixed and Example Pages

The login/register pages in `src/pages/auth` are typically required but need customization. You may also delete example pages (optional):

```bash
# Delete example page directories
src/pages/dashboard/
src/pages/profile/
src/pages/products/
# ... other unneeded pages
```

## 5. APIs and Mock Data

Menu, notifications, and page data in the template are mocked in `src/api/`. For production, replace with actual backend APIs. The `src/utils/http.ts` file handles request interception - modify according to your backend API specifications.

## 6. Layout Extensions

Customize account menu when hovering over user avatar in `src/layouts/account-menu-items.tsx`. The template uses "Profile" as an example.

Additional toolbar buttons can be configured in `src/layouts/toolbar-buttons.tsx`. The template uses "Notifications" and "Chat" as examples.

## 7. Start Development Server

```bash
bun dev
```

After successful startup, visit <http://localhost:5173> (port may vary, check terminal output)

## 8. Build for Production

```bash
# Build project
bun run build

# Preview build result
bun run preview
```

## 9. Code Quality Check

```bash
# Run full check (lint and format)
bun run check

# Auto-fix code issues
bun run check:fix

# Lint only
bun run lint

# Format only
bun run format
```

---

# IV. Internationalization

System-wide text supports Simplified Chinese and English by default, located in `src/locales`.

The `system` folder contains system configuration and common text, usually no modification needed. To add a new language, refer to existing language files, add the language to `LOCALE_MODULES` array in `src/locales/system/index.ts`, and add the corresponding type in `src/locales/system/types.ts`.

The `pages` folder organizes page text by directory structure.

If your project doesn't need multi-language support, you can hardcode text directly in page code. Set the default language and disable the language switch option.

Note that ProComponents has its own internationalization options.

---

# V. Styles and Themes

## 1. Using CSS Variables

The project integrates Ant Design's CSS variable system. Use variables to support theme switching:

```tsx
// In style attribute
<div style={{
  color: 'var(--ant-color-primary)',
  background: 'var(--ant-color-bg-container)',
  borderColor: 'var(--ant-color-border)',
}}>

// In Tailwind (v4 syntax)
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

Refer to Ant Design documentation for more variables.

## 2. Using RemixIcon

The project includes RemixIcon library with well-designed, consistent icons. Use `ri-*` class names:

```tsx
<i className="ri-dashboard-line" />
<i className="ri-user-fill" />
<i className="ri-settings-3-line" style={{ fontSize: '20px' }} />
```

Icon naming convention:

- `-line` suffix: Line icons
- `-fill` suffix: Filled icons

Full icon list: [remixicon.com](https://remixicon.com/)

## 3. Tailwind CSS

The project uses Tailwind CSS v4 with all standard utility classes:

```tsx
<div className="flex items-center gap-4 p-4 rounded-lg">
  <span className="text-sm font-medium">Content</span>
</div>
```

---

# VI. State Management

## 1. Zustand Store

The project uses Zustand for state management. Store files are in `src/store/`:

```ts
// src/store/order-store.ts
import { create } from 'zustand';

interface OrderState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  fetchOrders: async () => {
    set({ loading: true });
    const data = await fetchOrdersApi();
    set({ orders: data, loading: false });
  },
}));
```

## 2. Using in Components

```tsx
import { useOrderStore } from '@/store/order-store';

function OrderList() {
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <Spin />;

  return <Table dataSource={orders} />;
}
```

## 3. Built-in Stores

| Store | Purpose |
|-------|---------|
| `useSystemStore` | System settings (theme, layout, language, etc.) |
| `useUserStore` | User information |
| `useMenuStore` | Menu data |

```tsx
import { useSystemStore, useUserStore } from '@/store';

const { locale, themeMode } = useSystemStore();
const { userInfo } = useUserStore();
```

---

# VII. Development Guidelines

## 1. File Naming

| Type | Convention | Example |
|------|------------|---------|
| Page files | kebab-case | `order-list.tsx` |
| Component files | kebab-case | `order-card.tsx` |
| Store files | kebab-case | `order-store.ts` |
| Utility files | kebab-case | `format-date.ts` |
| Type files | kebab-case | `order-types.ts` |

## 2. Code Checking

```bash
# Auto-fix during development
bun check:fix

# Check only
bun check

# Check before build (includes type checking)
bun build
```

---

# VIII. Common Configurations

## 1. API Configuration

**src/utils/http.ts** - HTTP request wrapper:

```ts
// Modify request interceptor to add Token
config.headers.Authorization = `Bearer ${token}`;

// Modify response interceptor for error handling
if (response.data.code !== 0) {
  message.error(response.data.message);
}
```

## 2. Build Chunking Configuration

The project uses `advancedChunks` in **vite.config.ts** for code splitting by dependency update frequency and functional modules:

| Chunk | Contents | Reason |
|-------|----------|--------|
| `vendor-react` | React, React DOM, React Router | Stable versions, long-term cache |
| `vendor-antd` | Ant Design component library | Updates frequently, separate cache |
| `vendor-utils` | Other third-party libraries | Least changes, long-term cache |
| `system` | System components, store, layouts, i18n, config, utils | Core framework, high reuse |
| `page-{name}` | Business pages (auto-split by `src/pages/` directory) | Lazy loading, reduce initial bundle |

This splitting maximizes browser caching - only the modified chunk needs to be re-downloaded.

---

**Last Updated:** 2025-12-13
