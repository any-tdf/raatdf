# 一、从零开始

## 1. 环境准备

确保已安装以下工具：

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0（推荐）或 npm/yarn/pnpm
- **Git** 版本控制工具
- **VS Code**（推荐）或其他代码编辑器

## 2. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/any-tdf/raatdf.git

# 或使用 SSH
git clone git@github.com:any-tdf/raatdf.git

# 进入项目目录
cd raatdf
```

## 3. 安装依赖

```bash
# 使用 Bun（推荐，速度更快）
bun install

# 或使用其他包管理器
npm install
# yarn install
# pnpm install
```

# 二、项目结构

```
raatdf/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口定义
│   │   └── mocks/      # Mock 数据
│   ├── components/     # 公共组件
│   │   └── system/     # 系统组件
│   ├── config/         # 配置文件
│   ├── layouts/        # 布局组件
│   ├── locales/        # 国际化文件
│   ├── pages/          # 页面组件
│   ├── store/          # 状态管理
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── app.tsx         # 应用入口
│   └── main.tsx        # 主入口文件
├── biome.json          # Biome 配置
├── tailwind.config.ts  # Tailwind CSS 配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

---

# 三、初始配置

## 1. 系统名称

`src/locales/system/` 修改对应语言的系统名称，如：

```ts
system: {
  name: '你的系统名称',  // 修改为你的项目名称
}
```

## 2. 功能开关配置

项目支持通过配置文件控制系统设置面板中显示的选项。在 **src/config/system.ts** 中修改 `FEATURE_FLAGS`：

```ts
export const FEATURE_FLAGS = {
  themeMode: true,        // 主题模式切换
  primaryColor: true,     // 主题色选择
  menuLayout: true,       // 菜单布局
  contentWidth: true,     // 内容宽度
  floatingUI: true,       // 悬浮界面
  borderRadius: true,     // 界面圆角
  language: true,         // 界面语言设置
  refreshButton: true,    // 刷新按钮
  collapseButton: true,   // 折叠按钮
  headerButtons: true,    // 顶部按钮
  immersiveMode: true,    // 沉浸模式
  cardContainer: true,    // 卡片容器
  compactMode: true,      // 紧凑模式
  sidebarToolbar: true,   // 侧边栏工具栏
  tabs: true,             // 多标签页
  tabsStyle: true,        // 标签页样式
  pageCache: true,        // 页面缓存
  pageTransition: true,   // 页面切换动画
  fullscreen: true,       // 全屏模式
};
```

**使用说明：**

- 设置为 `true`：该设置项会在系统设置面板中显示，用户可以修改
- 设置为 `false`：该设置项不会在设置面板中显示，将使用 `SYSTEM_DEFAULTS` 中的默认值
- 将功能开关设置为 `false` 不会影响功能本身，只是隐藏设置选项

例如，如果你的项目不需要多标签页功能的设置选项，可以将 `tabs: true` 改为 `tabs: false`。

## 3. 系统默认配置

在 **src/config/system.ts** 中的 `SYSTEM_DEFAULTS` 对象包含所有配置项的默认值：

```ts
export const SYSTEM_DEFAULTS = {
  theme: {
    themeMode: 'system',      // 主题模式：'light' | 'dark' | 'system'
    primaryColor: '#1677ff',  // 主题色
  },
  layout: {
    menuLayout: 'vertical',   // 菜单布局：'vertical' | 'horizontal' | 'mixed'
    contentWidth: 'full',     // 内容宽度：'full' | 'fixed'
    fixedWidthMax: 1200,      // 定宽布局最大宽度
    enableFloatingUI: true,   // 悬浮界面
    borderRadius: 8,          // 圆角大小：0-24
  },
  // ... 更多配置
};
```

根据项目需求修改这些默认值，这样即使隐藏了某些设置选项，系统仍会使用你配置的默认值。

## 4. 固定与示例页面

一般来说，系统的登录/注册页面是固定需要的，但内容需要修改 `src/pages/auth`。也可能需要删除示例页面（可选）：

```bash
# 删除示例页面目录
src/pages/dashboard/
src/pages/profile/
src/pages/products/
# ... 其他不需要的页面
```

## 5. 接口与模拟数据

模板项目中的菜单、通知内容、页面接口等数据是在 `src/api/` 文件夹内模拟的，实际项目一般是从后端获取，所有请根据你的项目删除或修改模拟数据与接口。另外在 `src/utils/http.ts`文件对请求做了常规的拦截处理，请根据你与后端的接口规范修改。

## 6. 页面布局拓展

一般来说，当光标激活用户头像时触发的功能是需要根据你的系统自定义的，可以在`src/layouts/account-menu-items.tsx`里面配置账号菜单扩展，系统使用【个人中心】作为示例。

另外这个区域除了头像与设置按钮外，还可以根据配置实现自己定义的功能，在`src/layouts/toolbar-buttons.tsx`配置，系统使用【通知按钮】与【聊天按钮】作为示例。

## 7. 启动开发服务器

```bash
bun dev
```

启动成功后，访问 <http://localhost:5173>（端口可能不同，请查看终端输出）

## 8. 构建生产版本

```bash
# 构建项目
bun run build

# 预览构建结果
bun run preview
```

## 9. 代码质量检查

```bash
# 运行完整检查（包含 lint 和 format）
bun run check

# 自动修复代码问题
bun run check:fix

# 仅检查代码规范
bun run lint

# 仅检查代码格式
bun run format
```

---

# 四、多语言

系统的全局配置文案默认支持简体中文与英文，均放在`src/locales`内。

system 属于系统配置与公共部分的文案，一般不用修改。如果想增加一种语言，则参考中英文语言文件增加对应文案，并在`src/locales/system/index.ts`中的 LOCALE_MODULES 数组增加语言项，最好在`src/locales/system/types.ts`中也增加对应类型 Locale。

pages 按照页面目录结构放置页面的文案。

如果确定你的项目当前及后续都没有多语言的计划，页面文案可以直接在页面代码内硬编码，那么设置好默认语言之后关闭多语言设置项就关闭了切换语言的功能。

另外需要注意的是 ProComponents 内部有自己的多语言选项，使用时请注意。

---

# 五、样式与主题

## 1. 使用 CSS 变量

项目集成了 Ant Design 的 CSS 变量系统，推荐使用变量以支持主题切换：

```tsx
// 在 style 属性中使用
<div style={{
  color: 'var(--ant-color-primary)',
  background: 'var(--ant-color-bg-container)',
  borderColor: 'var(--ant-color-border)',
}}>

// 在 Tailwind 中使用（v4 语法）
<div className="text-(--ant-color-primary) bg-(--ant-color-bg-container)">
```

其余变量请参考 Ant Design。

## 2. 使用 RemixIcon

项目集成了 RemixIcon 图标库，优点是设计精致，风格统一，数量丰富。使用 `ri-*` 类名：

```tsx
<i className="ri-dashboard-line" />
<i className="ri-user-fill" />
<i className="ri-settings-3-line" style={{ fontSize: '20px' }} />
```

图标命名规则：

- `-line` 后缀：线性图标
- `-fill` 后缀：填充图标

完整图标列表：[remixicon.com](https://remixicon.com/)

## 3. Tailwind CSS

项目使用 Tailwind CSS v4，支持所有标准工具类：

```tsx
<div className="flex items-center gap-4 p-4 rounded-lg">
  <span className="text-sm font-medium">内容</span>
</div>
```

---

# 六、状态管理

## 1. Zustand Store

项目使用 Zustand 进行状态管理，Store 文件放在 `src/store/` 目录：

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

## 2. 在组件中使用

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

## 3. 系统内置 Store

| Store | 用途 |
|-------|------|
| `useSystemStore` | 系统设置（主题、布局、语言等） |
| `useUserStore` | 用户信息 |
| `useMenuStore` | 菜单数据 |

```tsx
import { useSystemStore, useUserStore } from '@/store';

const { locale, themeMode } = useSystemStore();
const { userInfo } = useUserStore();
```

---

# 七、开发规范

## 1. 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面文件 | kebab-case | `order-list.tsx` |
| 组件文件 | kebab-case | `order-card.tsx` |
| Store 文件 | kebab-case | `order-store.ts` |
| 工具函数 | kebab-case | `format-date.ts` |
| 类型文件 | kebab-case | `order-types.ts` |

## 2. 代码检查

```bash
# 开发时自动修复问题
bun check:fix

# 仅检查不修复
bun check

# 构建前检查（包含类型检查）
bun build
```

---

# 八、常用配置

## 1. API 配置

**src/utils/http.ts** - HTTP 请求封装：

```ts
// 修改请求拦截器添加 Token
config.headers.Authorization = `Bearer ${token}`;

// 修改响应拦截器处理错误
if (response.data.code !== 0) {
  message.error(response.data.message);
}
```

## 2. 构建拆包配置

项目在 **vite.config.ts** 中使用 `advancedChunks` 进行代码分割，按依赖更新频率和功能模块拆分：

| 分组 | 包含内容 | 拆分理由 |
|-----|---------|---------|
| `vendor-react` | React、React DOM、React Router | 版本稳定，长期缓存 |
| `vendor-antd` | Ant Design 组件库 | 更新较频繁，独立缓存 |
| `vendor-utils` | 其他第三方库 | 变化最少，长期缓存 |
| `system` | 系统组件、store、布局、国际化、配置、工具函数 | 框架核心，复用率高 |
| `page-{name}` | 各业务页面（按 `src/pages/` 目录自动拆分） | 按需加载，减少首屏体积 |

这种拆分方式可以最大化利用浏览器缓存，单个模块修改时只需重新下载对应 chunk。

---

**最后更新:** 2025-12-16
