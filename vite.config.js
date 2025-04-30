// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/js/main.js',
      output: {
        format: 'iife',
        name: 'app',
        entryFileNames: 'app.min.js',
        globals: {
          'gsap': 'gsap',
          '@barba/core': 'barba',
          '@studio-freight/lenis': 'Lenis'
        }
      },
      external: ['gsap', '@barba/core', '@studio-freight/lenis']
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  }
});