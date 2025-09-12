import request from '@/utils/request';

// 登录请求返回的数据结构
interface LoginResponse {
  token: string;
}

export function login(data: { username: string, password: string }): Promise<LoginResponse> {
  return request.post('/auth/login', data);
}