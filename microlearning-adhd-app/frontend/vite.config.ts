import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const BACKEND_PORT = process.env.PORT ?? '8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}`,
    },
  },
})
