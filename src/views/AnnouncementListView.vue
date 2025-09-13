<template>
  <div class="common-layout">
    <el-header class="page-header">
      <span class="header-title">来点色图</span>
      <el-button type="primary" plain @click="goToLogin">管理员登录</el-button>
    </el-header>

    <el-main class="page-main">
      <div class="announcement-list-container">
        <div v-if="loading" v-loading="loading" class="loading-placeholder"></div>
        <ul v-else-if="list.length > 0" class="announcement-list">
          <li
            v-for="item in list"
            :key="item.id"
            class="announcement-item"
            @click="viewDetail(item.id)"
          >
            <div class="item-left">
              <el-tag v-if="item.sticky" type="danger" size="small" effect="dark" class="sticky-tag">置顶</el-tag>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <div class="item-right">
              <span class="item-date">{{ new Date(item.publishTime).toLocaleDateString() }}</span>
            </div>
          </li>
        </ul>
        <el-empty v-else description="暂无通知公告" />

        <el-pagination
          v-if="total > 0"
          background
          layout="prev, pager, next"
          :total="total"
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          @current-change="handlePageChange"
          class="pagination-container"
        />
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
// ... script 部分无需改动，保持原样 ...
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getAnnouncements } from '@/api/announcement';
import type { Announcement } from '@/types/api';

const router = useRouter();
const loading = ref(true);
const list = ref<Announcement[]>([]);
const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 15,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.page - 1,
      size: pagination.size,
      sort: ['sticky,desc', 'publishTime,desc'],
    };
    const res = await getAnnouncements(params);
    list.value = res.content;
    total.value = res.totalElements;
  } catch (error) {
    console.error("获取公告列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

const viewDetail = (id: number) => {
  router.push({ name: 'AnnouncementDetail', params: { id } });
};

const goToLogin = () => {
  router.push({ name: 'Login' });
};
onMounted(fetchData);
</script>

<style scoped>
.common-layout {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 5%; /* 增加左右内边距 */
  box-sizing: border-box;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-main {
  /* 核心改动：使用百分比宽度和更大的max-width */
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0;
}

.announcement-list-container {
  background-color: #fff;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.loading-placeholder {
  height: 400px;
}

.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.announcement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 10px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.announcement-item:hover {
  background-color: #f5f7fa;
}

.item-left {
  display: flex;
  align-items: center;
  min-width: 0; /* 允许flex item收缩 */
}

.sticky-tag {
  margin-right: 12px;
  flex-shrink: 0;
}

.item-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.announcement-item:hover .item-title {
  color: #409eff;
}

.item-right {
  flex-shrink: 0;
  margin-left: 30px;
}

.item-date {
  font-size: 15px;
  color: #909399;
}

.pagination-container {
  margin-top: 30px;
  justify-content: center;
}

/* 响应式设计：针对小屏幕 */
@media (max-width: 768px) {
  .page-main {
    width: 100%;
    margin: 0;
  }
  .announcement-list-container {
    border-radius: 0;
    padding: 15px 20px;
  }
  .announcement-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .item-right {
    margin-left: 0;
    margin-top: 8px;
  }
  .item-date {
    font-size: 13px;
  }
}
</style>