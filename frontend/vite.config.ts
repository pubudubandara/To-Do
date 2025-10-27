import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true, 
    proxy: {
      '/api': {
        // For local dev use localhost. If running via Docker compose, set USE_DOCKER=true in env and restart Vite.
        target: process.env.USE_DOCKER === 'true' ? 'http://backend:5000' : 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  }
})
