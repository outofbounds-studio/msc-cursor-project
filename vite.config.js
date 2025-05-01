// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'app.js',
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