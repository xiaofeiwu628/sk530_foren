import request from '@/utils/request';
import type { Announcement, Page } from '@/types/api';


/**
 * 1. 获取通知列表 (公开)
 */
// 将 `sort: string` 修改为 `sort: string | string[]`
export function getAnnouncements(params: { page: number; size: number; sort: string | string[] }): Promise<Page<Announcement>> {
  // 后端分页从0开始，Element Plus分页从1开始，在调用时转换
  return request.get('/announcements', { params });
}

/**
 * 2. 获取单个通知详情 (公开)
 */
// 添加返回类型 Promise<Announcement>
export function getAnnouncementById(id: number): Promise<Announcement> {
  return request.get(`/announcements/${id}`);
}

/**
 * 4. 创建通知 (仅管理员)
 */
// 添加返回类型 Promise<Announcement>
export function createAnnouncement(data: FormData): Promise<Announcement> {
  return request.post('/announcements', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 5. 更新通知 (仅管理员)
 */
// 添加返回类型 Promise<Announcement>
export function updateAnnouncement(id: number, data: FormData): Promise<Announcement> {
  return request.put(`/announcements/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 6. 删除通知 (仅管理员)
 */
// 删除操作通常返回 void 或一个简单的成功消息对象，这里假设为 void
export function deleteAnnouncement(id: number): Promise<void> {
  return request.delete(`/announcements/${id}`);
}