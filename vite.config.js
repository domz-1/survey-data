import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true // Enable server to be accessible from any IP
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    // Needed for .mjs files
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      // Add source directory alias for better imports
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '/' // Ensure proper base URL for assets
});