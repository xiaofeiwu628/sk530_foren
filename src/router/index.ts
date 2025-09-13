import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
// 1. 引入安全验证函数
import { isUserAdminSecure, isTokenValid } from '@/utils/auth';

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
    meta: { requiresAdmin: true } // 需要认证
  },
  {
    path: '/admin/announcements/new',
    name: 'AdminAnnouncementNew',
    component: () => import('../views/admin/AnnouncementNewView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/announcements/edit/:id',
    name: 'AdminAnnouncementEdit',
    component: () => import('../views/admin/AnnouncementEditView.vue'),
    props: true, // 将 :id 作为 prop 传递
    meta: { requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// --- 全局前置守卫 ---
// 2. 使用 isUserAdminSecure() 来构建安全守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    // 调用安全函数进行判断
    if (isUserAdminSecure()) {
      next(); // 是管理员，放行
    } else {
      ElMessage.error('您没有权限访问此页面，请以管理员身份登录。');
      // 如果已登录但不是管理员，则跳到首页；否则跳到登录页
      next(isTokenValid() ? { path: '/' } : { name: 'Login' });
    }
  } else {
    next(); // 不需要权限，直接放行
  }
});

export default router;