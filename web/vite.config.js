import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Served under /wildfire/ on the games hub.
  base: '/wildfire/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      // forward AI briefing calls to the local proxy server
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
