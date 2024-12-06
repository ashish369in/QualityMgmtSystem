import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/quality-management-system/',  // Add this line for GitHub Pages
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: [
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-label',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            'class-variance-authority',
            'clsx',
            'lucide-react',
            'tailwind-merge'
          ],
          forms: ['react-hook-form', '@hookform/resolvers'],
          query: ['@tanstack/react-query'],
          animation: ['framer-motion']
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
