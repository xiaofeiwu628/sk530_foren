import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue' // 假设你有一个 HomeView 组件


// 1. 定义路由
// 每个路由都需要映射到一个组件。
const routes = [
  {
    path: '/',
    name: 'root',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },

  // 你可以在这里添加更多路由
  // {
  //   path: '/about',
  //   name: 'about',
  //   // 路由级代码拆分
  //   // 这会为该路由生成一个单独的 chunk (About.[hash].js)
  //   // 当路由被访问时才会懒加载。
  //   component: () => import('../views/AboutView.vue')
  // }
]

// 2. 创建 router 实例
const router = createRouter({
  // 使用 HTML5 History 模式，让 URL 更美观
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 简写，相当于 `routes: routes`
})

// 3. 导出 router 实例，以便在 main.ts 中使用
export default router