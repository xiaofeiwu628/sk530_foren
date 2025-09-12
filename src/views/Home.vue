<template>
  <el-container class="announcement-home">
    <el-header class="header">
      <h1>校园通知公告</h1>
    </el-header>
    <el-main class="main-content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>最新公告</span>
          </div>
        </template>
        
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="title" label="标题" min-width="300">
            <template #default="scope">
              <el-link type="primary" @click="handleViewDetails(scope.row)">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="department" label="发布部门" width="180" />
          <el-table-column prop="date" label="发布时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button size="small" @click="handleViewDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next, jumper, ->, total"
            :total="total"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 定义公告的数据结构类型
interface Announcement {
  id: number;
  title: string;
  department: string;
  date: string;
  content: string; // 详情内容
}

// 响应式状态
const loading = ref(true);
const tableData = ref<Announcement[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 模拟的全部公告数据
const mockAllAnnouncements: Announcement[] = Array.from({ length: 35 }).map((_, i) => ({
  id: i + 1,
  title: `关于2025年秋季学期开学相关工作的通知 #${i + 1}`,
  department: i % 3 === 0 ? '教务处' : '学生工作处',
  date: `2025-09-${String(12 - Math.floor(i / 5)).padStart(2, '0')}`,
  content: `这是第 ${i + 1} 号通知的详细内容，请各位师生遵照执行。`
}));

// 模拟从API获取数据
const fetchData = (page: number, size: number) => {
  loading.value = true;
  // 模拟网络延迟
  setTimeout(() => {
    const start = (page - 1) * size;
    const end = start + size;
    tableData.value = mockAllAnnouncements.slice(start, end);
    total.value = mockAllAnnouncements.length;
    loading.value = false;
  }, 500);
};

// 处理分页改变事件
const handlePageChange = (page: number) => {
  fetchData(page, pageSize.value);
};

// 处理查看详情事件
const handleViewDetails = (row: Announcement) => {
  console.log('查看详情:', row);
  // 在实际应用中，这里会跳转到详情页或弹出对话框
  ElMessage.info(`正在查看: ${row.title}`);
};

// 组件挂载后加载第一页数据
onMounted(() => {
  fetchData(currentPage.value, pageSize.value);
});
</script>

<style scoped>
.announcement-home {
  height: 100vh;
  background-color: #f0f2f5;
}

.header {
  background-color: #409EFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.main-content {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>