import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    // --- 添加以下配置 ---
    host: true, // 监听所有地址，包括局域网和公网地址
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    // 允许通过 ngrok 域名访问
    allowedHosts: [
      '9e7e4bd7a9e4.ngrok-free.app' // 将这里替换为您自己的 ngrok 域名
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})