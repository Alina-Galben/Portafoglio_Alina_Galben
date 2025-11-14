import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5174,
    strictPort: true, // Forza Vite a usare solo questa porta
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false // Reduce overhead on mobile
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          charts: ['recharts'],
          contentful: ['contentful', '@contentful/rich-text-react-renderer']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-is',
      'framer-motion',
      'lucide-react',
      'react-router-dom',
      'react-helmet-async',
      'recharts',
      'date-fns',
      'react-hot-toast',
      'swr'
    ],
    force: true
  },
})
