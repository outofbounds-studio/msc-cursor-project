// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/js/main.js',
      name: 'webflowCursorProject',
      fileName: 'main',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true,
        globals: {
          gsap: 'gsap',
          jquery: '$',
          '@barba/core': 'barba',
          swiper: 'Swiper',
          '@studio-freight/lenis': 'Lenis'
        }
      }
    }
  }
});