import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    host: true,
    port: 8001,
    strictPort: true,
    open: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      'class-variance-authority': path.resolve(__dirname, 'node_modules/class-variance-authority/dist/index.js'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@radix-ui/react-dialog'],
  },
})