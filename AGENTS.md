# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun run dev          # Start development server (http://localhost:5173+)
bun run build        # Type-check and build with Vite Plus
bun run preview      # Preview production build

# Code Quality
bun run check:fix  # Auto-fix linting and formatting issues
bun run check      # Run formatting, linting, and type checks
bun run test       # Run Vite Plus Vitest with Happy DOM

# Dependencies
bun install       # Install dependencies
bun add <package> # Add a new dependency

# Individual commands (available via package.json)
bun run lint       # Run Oxlint only
bun run lint:fix   # Fix linting issues only
bun run format     # Check formatting with Oxfmt
bun run format:fix # Format code with Oxfmt
```

## Project Architecture

This is an enterprise admin template called "RAATDF" built with modern React technologies, featuring a sophisticated theming system and unique CSS integration.

### Technology Stack

- **Frontend**: React 19.2.8 + TypeScript 7 with strict mode
- **Build Tool**: Vite Plus 0.2.6 with Vite 8.1.5 core
- **UI Framework**: Ant Design 6.5.1 with Chinese locale (zhCN)
- **Advanced Components**: ProComponents 3.1.14-4
- **Styling**: Tailwind CSS v4.3.3 custom integrated with Ant Design CSS variables
- **State Management**: Zustand with persistence middleware
- **Routing**: React Router DOM v7.18.1
- **Icons**: RemixIcon v4.9.1
- **Code Quality**: Vite Plus with Oxfmt, Oxlint, and TypeScript checks

### Core Architecture Patterns

#### Theme System

The project implements a sophisticated three-mode theming system:

- **Light Mode**: Fixed light theme
- **Dark Mode**: Fixed dark theme
- **System Mode**: Automatically follows OS preference with live updates

**Key files:**

- `src/store/system-store.ts` - Zustand store with versioned localStorage persistence
- `src/components/system/theme-provider.tsx` - Ant Design algorithm and token integration
- `src/app.css` - Tailwind CSS v4 theme tokens and shared styles

#### CSS Integration Strategy

Unique integration combining Ant Design CSS variables with Tailwind CSS:

- Ant Design components use CSS variables (e.g., `var(--ant-color-primary)`)
- Tailwind custom colors map to Ant Design variables
- Enables seamless theme switching between both systems

Example usage:

```jsx
// In Tailwind classes
className = 'bg-(--ant-color-bg-container) text-(--ant-color-text)';
```

#### State Management Pattern

- Zustand for authentication, menu, notification, tabs, and system preferences
- Local useState for component-specific state
- Persistence via localStorage middleware
- Full TypeScript type safety

### Important Architectural Decisions

#### Animation System

Custom CSS animations in `src/app.css`:

- `float`, `rotate`, `twinkle` for decorative elements
- Performance optimized with `will-change` and GPU acceleration
- Particle effects using Tailwind animation classes combined with custom keyframes

#### Component Architecture

- Functional components with hooks, except the React error boundary required by the class API
- TypeScript interfaces for all props and state
- Ant Design components for UI consistency
- Tailwind for layout, spacing, and custom styling

#### Development Workflow

- Vite Plus handles formatting, linting, and type checks
- React Compiler enabled for optimization
- Import organization and CSS class sorting automated
- Tab indentation (2 spaces) enforced by Oxfmt

### Code Conventions

#### Naming & Structure

- **Components**: PascalCase (e.g., `ThemeToggle.tsx`)
- **Variables**: camelCase (e.g., `themeMode`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `THEME_STORAGE_KEY`)
- **Files**: Feature-based organization in `src/`

#### Styling Patterns

- Use Ant Design CSS variables for theme-aware styling
- Tailwind utilities for layout and spacing
- Custom styles in `style` props for dynamic CSS variables
- CSS classes sorted automatically by Oxfmt

#### TypeScript

- Strict mode enabled globally
- Interface definitions for all props and state
- Type exports from `src/store/types.ts`
- Explicit return types for complex functions

### Key Configuration Files

#### `vite.config.ts`

- Vite Plus toolchain configuration
- Oxfmt formatting, import organization, and Tailwind CSS class sorting
- Oxlint linting and TypeScript checking
- React Compiler enabled for optimization
- Tailwind CSS integration
- Modern ES module setup

#### `src/app.css`

- Tailwind CSS v4 `@theme` tokens
- Explicit Tailwind and Ant Design CSS layer order
- Dark mode integration with Ant Design CSS variables

### Development Notes

#### Chinese Localization

All UI text uses Simplified Chinese and English locale modules under `src/locales/`.

#### Theme Development

When working with themes:

1. Always use Ant Design CSS variables, not hardcoded colors
2. Test across all three theme modes (light/dark/system)
3. Define reusable Tailwind CSS v4 values in `src/app.css` instead of arbitrary values
4. Theme preferences persist automatically through a versioned store

#### Performance Considerations

- React Compiler handles most optimizations
- Use CSS transforms for animations (GPU accelerated)
- Ant Design CSS variables prevent re-renders during theme switches
- Rolldown-based Vite provides fast development builds

#### Common Patterns

```jsx
// Theme-aware styling
<div style={{ backgroundColor: 'var(--ant-color-bg-container)' }}>

// Color utilities
<span className={antdColors.textSecondary}>

// State management
const { mode, toggleTheme } = useThemeStore();

// Ant Design components with Chinese locale
<ConfigProvider locale={zhCN}>
```
