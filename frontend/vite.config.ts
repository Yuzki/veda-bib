import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Docker Compose 内で接続する場合、バックエンド名を `http://backend:5000` とする
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/search': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
