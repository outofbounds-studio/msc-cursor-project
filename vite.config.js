// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/js/main.js',
      output: {
        format: 'iife',
        entryFileNames: 'app.min.js',
        dir: 'docs'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  }
});