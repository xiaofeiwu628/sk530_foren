<template>
  <div class="common-layout">
    <el-main class="page-main">
      <el-page-header @back="goBack" class="page-header-nav">
        <template #content>
          <span class="text-large font-600 mr-3">返回列表</span>
        </template>
      </el-page-header>

      <div v-if="loading" v-loading="loading" class="loading-placeholder"></div>
      <div v-else-if="announcement" class="detail-container">
        <div class="detail-header">
          <h1 class="detail-title">{{ announcement.title }}</h1>
          <div class="detail-meta">
            <span>发布于: {{ new Date(announcement.publishTime).toLocaleString() }}</span>
            <el-divider direction="vertical" />
            <span>发布人: {{ announcement.creatorName }}</span>
          </div>
        </div>

        <div v-html="announcement.content" class="announcement-content"></div>

        <div v-if="announcement.attachments && announcement.attachments.length > 0" class="attachment-section">
          <el-divider content-position="left">附件下载</el-divider>
          <ul class="attachment-list">
            <li v-for="att in announcement.attachments" :key="att.id" class="attachment-item">
              <el-icon><Paperclip /></el-icon>
              <a :href="getDownloadUrl(att.id)" target="_blank" rel="noopener noreferrer" class="attachment-link">
                {{ att.fileName }}
                <span class="file-size">({{ (att.fileSize / 1024).toFixed(2) }} KB)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <el-empty v-else description="公告不存在或已被删除" />
    </el-main>
  </div>
</template>

<script setup lang="ts">
// ... script 部分无需改动，保持原样 ...
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAnnouncementById } from '@/api/announcement';
import type { Announcement } from '@/types/api';
import { Paperclip } from '@element-plus/icons-vue';

const props = defineProps<{ id: string }>();
const router = useRouter();

const loading = ref(true);
const announcement = ref<Announcement | null>(null);

const fetchData = async () => {
  loading.value = true;
  try {
    announcement.value = await getAnnouncementById(Number(props.id));
  } catch (error) {
    console.error("获取公告详情失败:", error);
    announcement.value = null;
  } finally {
    loading.value = false;
  }
};

const getDownloadUrl = (attachmentId: number) => {
  return `/api/announcements/attachments/${attachmentId}/download`;
};

const goBack = () => {
  router.back();
};

onMounted(fetchData);
</script>

<style scoped>
.common-layout {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-main {
  /* 核心改动：使用百分比宽度和更大的max-width */
  width: 90%;
  max-width: 1100px;
  margin: 20px auto;
  padding: 0;
}

.page-header-nav {
  margin-bottom: 20px;
}

.loading-placeholder {
  height: 500px;
  background-color: #fff;
  border-radius: 8px;
}

.detail-container {
  background-color: #fff;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.detail-header {
  text-align: center;
  padding-bottom: 25px;
  border-bottom: 1px solid #e4e7ed;
}

.detail-title {
  font-size: 30px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.detail-meta {
  font-size: 14px;
  color: #909399;
}

.announcement-content {
  padding: 40px 0;
  font-size: 16px;
  line-height: 1.8;
  color: #3c3c3c;
}

/* 使用 :deep() 穿透样式，美化富文本内容 */
.announcement-content :deep(p) {
  margin-bottom: 1.5em;
}
.announcement-content :deep(h1),
.announcement-content :deep(h2),
.announcement-content :deep(h3) {
  font-weight: 600;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.4;
}
.announcement-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 30px auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.announcement-content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-left: 4px solid #ccc;
  color: #666;
}

.attachment-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.attachment-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.attachment-item:hover {
  background-color: #f5f7fa;
}

.attachment-link {
  margin-left: 10px;
  color: #409eff;
  text-decoration: none;
  font-size: 15px;
}
.attachment-link:hover {
  text-decoration: underline;
}

.file-size {
  color: #a8abb2;
  font-size: 14px;
  margin-left: 10px;
}

/* 响应式设计：针对小屏幕 */
@media (max-width: 768px) {
  .page-main {
    width: 100%;
    margin: 0;
  }
  .detail-container {
    border-radius: 0;
    padding: 20px;
  }
  .detail-title {
    font-size: 24px;
  }
}
</style>