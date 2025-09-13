import { jwtDecode } from 'jwt-decode';
import type { LoginResponse } from '@/types/api';

// 1. 修正 DecodedToken 接口以匹配真实的 JWT 载荷
interface DecodedToken {
  sub: string;
  role: string; // 角色是一个字符串, e.g., "ROLE_ADMIN"
  exp: number;
}

const TOKEN_KEY = 'jwt_token';
const ROLE_KEY = 'user_role';
const USERNAME_KEY = 'user_username';

/**
 * 登录时调用：存储所有认证信息
 */
export function processLogin(data: LoginResponse): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(ROLE_KEY, data.role);
  localStorage.setItem(USERNAME_KEY, data.username);
}

/**
 * 登出时调用：清除所有认证信息
 */
export function processLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

/**
 * 获取Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * [用于UI] 获取存储的明文角色
 */
export function getUIRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

/**
 * [安全] 检查Token是否有效（存在且未过期）
 */
export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return Date.now() < decoded.exp * 1000;
  } catch (error) {
    return false;
  }
}

/**
 * [安全] 检查用户是否为管理员（通过解码JWT）
 * 这是路由守卫唯一应该使用的函数
 */
export function isUserAdminSecure(): boolean {
  if (!isTokenValid()) return false;
  try {
    const token = getToken()!;
    const decoded: DecodedToken = jwtDecode(token);
    // 2. 修正检查逻辑：直接比较 role 字符串
    return decoded.role === 'ROLE_ADMIN';
  } catch (error) {
    return false;
  }
}