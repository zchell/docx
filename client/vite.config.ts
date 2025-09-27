import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000, // Use port 5000 for Replit frontend
    strictPort: false,
    allowedHosts: true, // Allow all hosts for Replit proxy
    // Proxy API calls to the Express server running on different port
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err.message);
          });
        }
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'terser',
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      external: [],
      treeshake: true
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  base: './',
})