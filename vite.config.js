import { defineConfig } from 'vite';

export default defineConfig({
  // Set the root to client directory where your frontend code is
  root: 'client',
  
  // Development server configuration
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    allowedHosts: 'all',
    // Proxy API calls to your Express server
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

  // Build configuration  
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html'
    }
  },

  // Base path for assets
  base: './',
  
  // Include MSI files as assets
  assetsInclude: ['**/*.msi']
});