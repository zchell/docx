import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Entry point for Vite
  root: 'client',
  
  // Server configuration for Replit compatibility
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true
  },
  
  // Build configuration
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html')
    }
  },
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Base path for assets
  base: './',
  
  // Ensure proper asset handling
  assetsInclude: ['**/*.msi']
});