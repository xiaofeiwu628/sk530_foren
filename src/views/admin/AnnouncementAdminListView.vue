<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>通知管理</span>
        <el-button type="primary" @click="goToNew">新建通知</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="250">
        <template #default="{ row }">
          <el-link type="primary" @click="viewDetail(row.id)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="发布人" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'">
            {{ row.status === 'PUBLISHED' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.publishTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="goToEdit(row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > 0"
      background
      layout="prev, pager, next, jumper, ->, total"
      :total="total"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      @current-change="handlePageChange"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getAnnouncements, deleteAnnouncement } from '@/api/announcement';
import type { Announcement } from '@/types/api';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const loading = ref(true);
const list = ref<Announcement[]>([]);
const total = ref(0);
const pagination = reactive({ page: 1, size: 10 });

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
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

const goToNew = () => router.push({ name: 'AdminAnnouncementNew' });
const goToEdit = (id: number) => router.push({ name: 'AdminAnnouncementEdit', params: { id } });
const viewDetail = (id: number) => {
  router.push({ name: 'AnnouncementDetail', params: { id } });
};
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除此通知吗？此操作不可撤销。', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteAnnouncement(id);
      ElMessage.success('删除成功');
      fetchData(); // 重新加载数据
    } catch (error) {
      console.error("删除失败:", error);
    }
  }).catch(() => {
    // 用户取消操作
  });
};

onMounted(fetchData);
</script>