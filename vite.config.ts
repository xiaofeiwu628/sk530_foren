import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 将 /api 代理到后端服务
      '/api': {
        target: 'http://localhost:8080', // 替换为您的后端服务地址
        changeOrigin: true,
        // 如果后端接口路径本身不带 /api, 可以重写路径
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})