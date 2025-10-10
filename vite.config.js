import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/chotto-0.3-demo/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем библиотеку chotto на отдельный чанк
          'chotto': ['@mobilon-dev/chotto'],
          // Разделяем Vue и связанные библиотеки
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Разделяем утилиты
          'utils': ['axios', 'uuid', '@microsoft/fetch-event-source']
        }
      }
    },
    // Увеличиваем лимит предупреждения до 1000 kB
    chunkSizeWarningLimit: 1000
  }
})
