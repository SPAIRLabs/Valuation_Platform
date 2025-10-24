import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base for GitHub Pages deployment
  // Change 'SPAIRL-X-VAL' to your actual repository name
  base: process.env.NODE_ENV === 'production' ? '/SPAIRL-X-VAL/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
