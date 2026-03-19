import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('botframework-webchat-component') ||
            id.includes('botframework-webchat-core') ||
            id.includes('botframework-directlinejs') ||
            id.includes('botframework-webchat-api')
          ) {
            return 'webchat';
          }
        },
      },
    },
  },
})
