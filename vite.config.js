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
          gsap: 'gsap',
          Swiper: 'Swiper',
          barba: 'barba',
          Lenis: 'Lenis',
          $: 'jQuery'
        }
      },
      external: ['gsap', 'Swiper', 'barba', 'Lenis', 'jQuery']
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  }
});