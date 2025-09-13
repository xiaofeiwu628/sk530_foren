import axios from 'axios';
// 将 ant-design-vue 替换为 element-plus
import { ElMessage } from 'element-plus';
import { getToken, processLogout } from '@/utils/auth';

const service = axios.create({
  // baseURL: '/api', // 基础路径，会自动被 vite 代理
  baseURL: import.meta.env.VITE_API_BASE_URL , // 使用环境变量
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      // 3. 增加对 401/403 的处理，自动登出
      if (status === 401 || status === 403) {
        processLogout();
        ElMessage.error(data?.message || '认证已过期或无权限，请重新登录');
        // 使用 location.href 跳转以完全刷新应用状态
        window.location.href = '/login';
        return Promise.reject(new Error('认证失败'));
      }
      ElMessage.error(data?.message || '请求失败');
    } else {
      ElMessage.error('网络连接错误');
    }
    return Promise.reject(error);
  }
);
export default service;