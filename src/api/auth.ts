import request from '@/utils/request';
import type { LoginRequest, LoginResponse } from '@/types/api';

/**
 * 登录函数
 * @param data 包含用户名和密码的对象
 * @returns 返回一个包含 token 等信息的 Promise
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  // 请根据你的后端接口调整此路径
  return request.post('/auth/login', data);
}