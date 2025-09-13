// 附件的数据结构
export interface Attachment {
    id: number;
    fileName: string;
    fileSize: number; // in bytes
    fileType: string;
    downloadCount: number;
}

// 通知的类型和状态
export type AnnouncementType = 'NORMAL' | 'URGENT' | 'IMPORTANT';
export type AnnouncementStatus = 'PUBLISHED' | 'DRAFT';

// 通知的数据结构
export interface Announcement {
    id: number;
    title: string;
    content: string; // 可能为 HTML 字符串
    type: AnnouncementType;
    status: AnnouncementStatus;
    publishTime: string; // ISO 8601 格式的日期字符串
    expireTime: string | null;
    sticky: boolean;
    creatorName: string;
    createdAt: string;
    attachments: Attachment[];
}

// API 列表返回的分页结构
export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number; // 当前页码 (从0开始)
}
// 登录请求体
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录成功后的响应体
// 确保这个接口是完整的，包含所有后端返回的字段
export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresIn: number;
}
