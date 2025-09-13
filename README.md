# 通知公告发布系统 (Vue 3 + Element Plus)

这是一个功能完善的前后台分离的通知公告系统前端项目。它使用 Vue 3、Vite、TypeScript 和 Element Plus 构建，提供了一个美观、响应式的用户界面，以及一套完整的管理员后台功能。


## ✨ 功能特性

### 面向公众 (Public)
- **公告列表**: 分页展示所有已发布的通知公告。
- **置顶功能**: 重要的置顶公告会优先显示。
- **公告详情**: 查看公告的完整内容、发布人、发布时间及附件。
- **附件下载**: 安全地下载公告所附带的文件。
- **响应式设计**: 在桌面和移动设备上均有良好的浏览体验。

### 管理员后台 (Admin)
- **安全登录**: 基于 JWT (JSON Web Token) 的管理员身份认证。
- **路由守卫**: 未经授权的用户无法访问任何后台管理页面。
- **仪表盘**: 集中管理所有通知，包括草稿和已发布的公告。
- **CRUD 操作**:
    - **创建 (Create)**: 使用富文本编辑器创建新通知。
    - **读取 (Read)**: 查看所有公告列表及详情。
    - **更新 (Update)**: 编辑已存在的通知内容和状态。
    - **删除 (Delete)**: 删除不再需要的通知。
- **富文本编辑器**: 集成 WangEditor，支持丰富的文本格式和**图片上传**功能。
- **附件管理**: 支持在创建和编辑时上传多个附件，并能在编辑时管理已有的附件。

## 🚀 技术栈

- **前端**:
    - **框架**: [Vue 3](https://vuejs.org/) (使用 Composition API 和 `<script setup>`)
    - **构建工具**: [Vite](https://vitejs.dev/)
    - **UI 库**: [Element Plus](https://element-plus.org/)
    - **路由**: [Vue Router](https://router.vuejs.org/)
    - **状态管理**: [Pinia](https://pinia.vuejs.org/)
    - **HTTP客户端**: [Axios](https://axios-http.com/)
    - **语言**: [TypeScript](https://www.typescriptlang.org/)
    - **富文本编辑器**: [WangEditor](https://www.wangeditor.com/)
- **后端 (对接)**:
    - Spring Boot (RESTful API)
    - Spring Security (JWT 认证授权)

## 本地部署与运行

### 1. 克隆项目
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. 安装依赖
推荐使用 `npm` 或 `pnpm`。
```bash
npm install
```

### 3. 配置后端代理
本项目使用 Vite 的代理功能来解决开发环境下的跨域问题。请打开 `vite.config.ts` 文件，根据您本地后端服务的地址修改 `proxy` 配置中的 `target`。

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 修改为你的后端服务地址
      changeOrigin: true,
    },
  },
  // ...
}
```

### 4. 启动项目
```bash
npm run dev
```
启动成功后，您可以在浏览器中访问 `http://localhost:5173` (或终端提示的其他端口)。

## 📜 可用脚本

- **`npm run dev`**: 启动开发服务器，支持热更新。
- **`npm run build`**: 将项目打包构建为生产环境的静态文件，输出到 `dist` 目录。
- **`npm run preview`**: 在本地预览生产环境的构建包。

## 目录结构 (简要)

```
.
├── public/               # 静态资源
├── src/
│   ├── api/              # API 请求模块
│   ├── assets/           # 静态资源 (图片、字体等)
│   ├── components/       # 可复用的 Vue 组件
│   ├── router/           # Vue Router 路由配置
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数 (如 request, auth)
│   ├── views/            # 页面级 Vue 组件
│   │   ├── admin/        # 管理员后台页面
│   │   └── ...
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口文件
│   └── style.css         # 全局样式
├── index.html            # HTML 入口文件
├── package.json          # 项目依赖与脚本
├── tsconfig.json         # TypeScript 配置文件
└── vite.config.ts        # Vite 配置文件
```