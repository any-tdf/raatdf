<div align="center">

[![Deploy to GitHub Pages](https://github.com/any-tdf/raatdf/actions/workflows/deploy.yml/badge.svg)](https://github.com/any-tdf/raatdf/actions/workflows/deploy.yml)

  <img src="https://raatdf.com/logo.png" alt="logo" width="120" height="auto" />

  <h1>RAATDF</h1>

![](https://img.shields.io/badge/-React%2019-%2361dafb?logo=react&logoColor=ffffff)
![](https://img.shields.io/badge/-Ant%20Design%206-%231890ff?logo=antdesign&logoColor=ffffff)
![](https://img.shields.io/badge/-Tailwind%20CSS%204-%2306b6d4?logo=tailwindcss&logoColor=ffffff)
![](https://img.shields.io/badge/-TypeScript%205-%233178c6?logo=typescript&logoColor=ffffff)
![](https://img.shields.io/badge/-Vite%208-%23646cff?logo=vite&logoColor=ffffff)
![](https://img.shields.io/badge/-Zustand%205-%23443e38)
![](https://img.shields.io/badge/-React%20Router%207-%23ca4245?logo=reactrouter&logoColor=ffffff)
![](https://img.shields.io/badge/-Biome%202-%2360a5fa?logo=biome&logoColor=ffffff)

[![GitHub stars](https://img.shields.io/github/stars/any-tdf/raatdf?logo=github&label=star&style=for-the-badge&color=A1DAD7&logoColor=D9F8F2&labelColor=011918)](https://github.com/any-tdf/raatdf)
[![GitHub license](https://img.shields.io/github/license/any-tdf/raatdf?logo=github&style=for-the-badge&color=B9C46A&logoColor=F3F3CB&labelColor=161901)](https://github.com/any-tdf/raatdf)

  <p>
    <a href="https://github.com/any-tdf/raatdf/blob/main/README.md" target="_blank">English</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_zh_CN.md" target="_blank">简体中文</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_zh_TW.md" target="_blank">繁體中文</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_ja_JP.md" target="_blank">日本語</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_ko_KR.md" target="_blank">한국어</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_es_ES.md" target="_blank">Español</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_ru_RU.md" target="_blank">Русский</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_fr_FR.md" target="_blank">Français</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_de_DE.md" target="_blank">Deutsch</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/raatdf/blob/main/readme/README_it_IT.md" target="_blank">Italiano</a>
  </p>
</div>

# Project Overview

RAATDF is an efficient, elegant, and lightweight enterprise-grade admin template built with the latest technology stack, providing an out-of-the-box solution.

# Quick Links

📺 [Live Demo](https://preview.raatdf.com) | 📖 [Documentation](https://raatdf.com) | 🐙 [GitHub Repository](https://github.com/any-tdf/raatdf)

# Core Technology Stack

- **Build Tool**: [Vite](https://vitejs.dev) v8 (Beta) - Lightning-fast development experience
- **Frontend Framework**: [React](https://react.dev) v19 - Latest version with React Compiler support
- **Type System**: [TypeScript](https://www.typescriptlang.org) v5 - Strict type checking
- **UI Framework**: [Ant Design](https://ant.design) v6 - Enterprise-grade UI component library
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4 - Atomic CSS framework
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs) v5 - Lightweight state management
- **Routing**: [React Router](https://reactrouter.com) v7 - Latest routing solution
- **Code Quality**: [Biome](https://biomejs.dev) - Unified lint and format tool

# Features

## Layout System

- **Multiple Layouts**: Sidebar, top bar, and mixed layouts
- **Responsive Design**: Perfect adaptation for all screen sizes
- **Floating UI**: Elegant floating UI style
- **Immersive Mode**: Full-screen experience focused on content
- **Sidebar Toolbar**: Place toolbar at the bottom of sidebar (vertical layout only)

## Theme System

- **Light/Dark Themes**: Light, dark, and system-follow modes
- **Theme Colors**: 10+ preset colors + custom colors
- **Dynamic Switching**: Seamless theme switching via CSS variables
- **Border Radius**: 9 radius sizes available (0-24px)

## Interaction Enhancement

- **Multi-Tab**: Up to 16 tabs, auto-closes oldest tab
- **Page Cache**: Preserves page state for better UX
- **Tab Styles**: Default, button, simple, and stacked styles
- **Transitions**: Slide, fade, zoom, and more animations
- **Compact Mode**: Suitable for data-intensive scenarios

## Display Options

- **Page Width**: Adaptive or fixed width
- **Card Container**: Card-style content display
- **Refresh Button**: Quick page refresh
- **Collapse Button**: Toggle sidebar expand/collapse
- **Header Buttons**: Notification center, chat window, and more

## Internationalization

- **Multi-Language**: Built-in Chinese and English, easily extensible
- **Full Translation**: System settings, menus, tooltips, etc.
- **Dynamic Switching**: Switch languages without page refresh

# Quick Start

## Requirements

- Node.js >= 18.0.0
- Bun >= 1.0.0 (recommended) or npm/yarn/pnpm

## Installation

```bash
# Clone the repository
git clone git@github.com:any-tdf/raatdf.git

# Enter project directory
cd raatdf

# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Common Commands

```bash
# Code checking and formatting
bun run check        # Run Biome checks
bun run check:fix    # Auto-fix code issues
bun run lint         # Lint only
bun run lint:fix     # Auto-fix lint issues
bun run format       # Check formatting
bun run format:fix   # Auto-format code
```

# Browser Compatibility

| Browser | Version |
|---------|---------|
| Chrome | >= 90 |
| Edge | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |

**Recommended**: Use the latest version of modern browsers for the best experience.

# Contributing

We welcome all forms of contributions, whether it's new features, bug fixes, or documentation improvements.

## How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Commit Convention

Please follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Testing related
- `chore`: Build/tool related

# Feedback & Communication

## Recommended

- 💬 [GitHub Issues](https://github.com/any-tdf/raatdf/issues) - Bug reports and feature requests
- 🔀 [GitHub Discussions](https://github.com/any-tdf/raatdf/discussions) - Discussions and Q&A

## Community

- 🌐 [Discord](https://discord.gg/DMkHu8GGre)

# Contributors

Thanks to all developers who have contributed to this project!

<a href="https://github.com/any-tdf/raatdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/raatdf" alt="Contributors" />
</a>

# Sponsors

If this project helps you, please consider sponsoring to support our continued development.

<!-- Sponsors list -->

# License

This project is licensed under [MIT](https://github.com/any-tdf/raatdf/blob/main/LICENSE).

# Star History

<a href="https://github.com/any-tdf/raatdf/stargazers">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/raatdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/raatdf&type=Timeline" />
  </picture>
</a>

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/any-tdf">any-tdf</a>
</p>
