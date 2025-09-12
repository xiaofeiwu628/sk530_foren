import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/announcements',
  },
  // ... 公开路由 ...
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/announcements',
    name: 'AnnouncementList',
    component: () => import('../views/AnnouncementListView.vue'),
  },
  {
    path: '/announcements/:id',
    name: 'AnnouncementDetail',
    component: () => import('../views/AnnouncementDetailView.vue'),
    props: true,
  },
  // --- 添加管理员路由 ---
  {
    path: '/admin/announcements',
    name: 'AdminAnnouncementList',
    component: () => import('../views/admin/AnnouncementAdminListView.vue'),
  },
  {
    path: '/admin/announcements/new',
    name: 'AdminAnnouncementNew',
    component: () => import('../views/admin/AnnouncementNewView.vue'),
  },
  {
    path: '/admin/announcements/edit/:id',
    name: 'AdminAnnouncementEdit',
    component: () => import('../views/admin/AnnouncementEditView.vue'),
    props: true, // 将 :id 作为 prop 传递
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// --- 全局前置守卫 ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token');
  const isAdminRoute = to.path.startsWith('/admin');

  if (isAdminRoute && !token) {
    // 如果访问的是管理员页面且没有 token，重定向到登录页
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    // 其他情况直接放行
    next();
  }
});
export default router;