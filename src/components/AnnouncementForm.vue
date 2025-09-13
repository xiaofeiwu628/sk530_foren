<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" v-loading="loading">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入通知标题" />
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <!-- 集成富文本编辑器 -->
      <div style="border: 1px solid #ccc; width: 100%;">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: 400px; overflow-y: hidden;"
          v-model="form.content"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
        />
      </div>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="form.type" placeholder="请选择类型">
        <el-option label="普通" value="NORMAL" />
        <el-option label="重要" value="IMPORTANT" />
        <el-option label="紧急" value="URGENT" />
        <el-option label="色色" value="URGENT" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio label="PUBLISHED">发布</el-radio>
        <el-radio label="DRAFT">草稿</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="置顶">
      <el-switch v-model="form.sticky" />
    </el-form-item>
    <el-form-item label="附件上传">
      <el-upload
        v-model:file-list="fileList"
        action="#"
        multiple
        :auto-upload="false"
      >
        <el-button type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">可上传多个文件，提交时一并上传</div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item v-if="isEditMode && form.retainedAttachmentIds.length > 0" label="已有附件">
        <div v-for="att in initialAttachments" :key="att.id" style="width: 100%;">
            <el-checkbox 
                :label="att.fileName" 
                :model-value="form.retainedAttachmentIds.includes(att.id)"
                @change="(checked: boolean) => handleAttachmentCheck(checked, att.id)"
            />
        </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, shallowRef, onBeforeUnmount } from 'vue';
import type { FormInstance, FormRules, UploadUserFile, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { createAnnouncement, updateAnnouncement } from '@/api/announcement';
import type { Announcement, Attachment } from '@/types/api';
// 引入 WangEditor
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'


const props = defineProps<{
  initialData?: Announcement;
}>();

const emit = defineEmits(['submit-success', 'cancel']);

const formRef = ref<FormInstance>();
const loading = ref(false);
const isEditMode = computed(() => !!props.initialData?.id);
// --- 富文本编辑器相关 ---
const editorRef = shallowRef();
const toolbarConfig: Partial<IToolbarConfig> = {};
const editorConfig: Partial<IEditorConfig> = { 
    placeholder: '请输入内容...',
    // 可以在这里配置图片上传等
};
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
// --- 结束 ---
const form = reactive({
  title: '',
  content: '',
  type: 'NORMAL',
  status: 'PUBLISHED',
  sticky: false,
  retainedAttachmentIds: [] as number[],
});

const initialAttachments = ref<Attachment[]>([]);
const fileList = ref<UploadUserFile[]>([]);

// 监听 initialData 变化，填充表单
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.title = newData.title;
    form.content = newData.content;
    form.type = newData.type;
    form.status = newData.status;
    form.sticky = newData.sticky;
    form.retainedAttachmentIds = newData.attachments.map((a: Attachment) => a.id);
    initialAttachments.value = [...newData.attachments];
  }
}, { immediate: true });

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
});



const handleAttachmentCheck = (checked: boolean | string | number, id: number) => {
    if (checked) {
        form.retainedAttachmentIds.push(id);
    } else {
        const index = form.retainedAttachmentIds.indexOf(id);
        if (index > -1) {
            form.retainedAttachmentIds.splice(index, 1);
        }
    }
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const formData = new FormData();
      
      const requestDto = {
        title: form.title,
        content: form.content,
        type: form.type,
        status: form.status,
        sticky: form.sticky,
        retainedAttachmentIds: isEditMode.value ? form.retainedAttachmentIds : [],
      };
      
      const requestBlob = new Blob([JSON.stringify(requestDto)], { type: 'application/json' });
      formData.append('request', requestBlob);

      fileList.value.forEach((file) => {
        if (file.raw) {
          formData.append('files', file.raw);
        }
      });

      try {
        if (isEditMode.value) {
          await updateAnnouncement(props.initialData!.id, formData);
          ElMessage.success('更新成功');
        } else {
          await createAnnouncement(formData);
          ElMessage.success('创建成功');
        }
        emit('submit-success');
      } finally {
        loading.value = false;
      }
    }
  });
};


const onCancel = () => {
    emit('cancel');
}
</script>