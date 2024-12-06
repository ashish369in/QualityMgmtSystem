import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include react refresh
      fastRefresh: true,
    })
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable sourcemaps for debugging
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
          query: ['@tanstack/react-query']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
