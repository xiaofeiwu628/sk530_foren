import axios from 'axios';
// 将 ant-design-vue 替换为 element-plus
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: '/api', // 基础路径，会自动被 vite 代理
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token'); // 从 localStorage 获取 token
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
    // 直接返回后端响应的 data 部分
    return response.data;
  },
  error => {
    // 使用 ElMessage 替换 message
    ElMessage.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default service;