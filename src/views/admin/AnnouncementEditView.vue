<template>
  <el-card>
    <template #header>编辑通知</template>
    <AnnouncementForm 
      v-if="initialData"
      :initial-data="initialData" 
      @submit-success="handleSuccess" 
      @cancel="handleCancel" 
    />
    <el-skeleton v-else :rows="5" animated />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AnnouncementForm from '@/components/AnnouncementForm.vue';
import { getAnnouncementById } from '@/api/announcement';
import type { Announcement } from '@/types/api';

const props = defineProps<{ id: string }>();
const router = useRouter();
const initialData = ref<Announcement | null>(null);

onMounted(async () => {
  try {
    initialData.value = await getAnnouncementById(Number(props.id));
  } catch (error) {
    console.error("加载通知数据失败:", error);
  }
});

const handleSuccess = () => {
  router.push({ name: 'AdminAnnouncementList' });
};

const handleCancel = () => {
  router.back();
};
</script>