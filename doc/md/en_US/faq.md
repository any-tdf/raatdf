# FAQ

## Environment Setup

### Q: Which package manager should I use?

Use **Bun**, it's faster than npm/yarn.

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

### Q: What Node.js version is required?

Minimum Node.js 18.0, recommended 20+.

---

## Development Issues

### Q: How to change the default port?

Modify `vite.config.ts`:

```ts
server: {
  port: 3000,
}
```

### Q: What is the import path alias?

Use `@/` to point to `src/` directory:

```tsx
import { useSystemStore } from '@/store';
```

### Q: How to add environment variables?

Create `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Use in code:

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Styling Issues

### Q: How to support theme switching?

Use CSS variables:

```tsx
// Recommended
<div style={{ color: 'var(--ant-color-primary)' }}>

// Avoid hardcoding
<div className="text-blue-500">
```

### Q: How to use icons?

Use RemixIcon:

```tsx
<i className="ri-user-line" />
<i className="ri-dashboard-line" style={{ fontSize: 20 }} />
```

Icon lookup: [remixicon.com](https://remixicon.com/)

### Q: Space component shows direction deprecation warning?

Use `vertical` attribute:

```tsx
// Correct
<Space vertical size="large">

// Deprecated
<Space direction="vertical" size="large">
```

---

## Internationalization

### Q: How to get text for current language?

```tsx
import { useSystemStore } from '@/store';
import { getDashboardLocale } from '@/locales';

const { locale } = useSystemStore();
const t = getDashboardLocale(locale);
```

### Q: How to add a new language?

1. Add type in `src/types/locale.ts`
2. Add translations in each locale file
3. Add option in language switch component

---

## Permission Issues

### Q: How to control menu permissions?

Set `roles` in menu configuration:

```ts
{
  key: 'admin',
  path: '/admin',
  roles: ['admin'],
}
```

### Q: How to protect routes?

```tsx
<Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>
```

---

## Build Issues

### Q: What to do if build fails?

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
bun install
bun build
```

### Q: Code check errors?

```bash
# Auto-fix
bun check:fix
```

---

## Others

### Q: How to configure proxy?

Modify `vite.config.ts`:

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

### Q: How to change system name?

Modify `system.name` in `src/locales/system/` for each language.
