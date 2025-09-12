<template>
  <el-card>
    <template #header>新建通知</template>
    <AnnouncementForm @submit-success="handleSuccess" @cancel="handleCancel" />
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AnnouncementForm from '@/components/AnnouncementForm.vue';

const router = useRouter();

const handleSuccess = () => {
  // 成功后跳转到管理列表页
  router.push({ name: 'AdminAnnouncementList' }); // 假设有这个路由
};

const handleCancel = () => {
    router.back();
}
</script>