// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/js/main.js',
      name: 'webflowCursorProject',
      formats: ['iife'],
      fileName: (format) => `main.${format}.js`
    },
    rollupOptions: {
      output: {
        format: 'iife',
        globals: {
          gsap: 'gsap',
          ScrollTrigger: 'ScrollTrigger',
          CustomEase: 'CustomEase',
          jQuery: '$',
          Vimeo: 'Vimeo',
          barba: 'barba',
          Lenis: 'Lenis',
          Swiper: 'Swiper'
        }
      }
    }
  }
});