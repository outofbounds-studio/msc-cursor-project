// Global dependencies
const { gsap, ScrollTrigger, CustomEase } = window;
const $ = window.jQuery;
const barba = window.barba;
const Lenis = window.Lenis;
const Swiper = window.Swiper;

// Export the initialization function
export function init() {
    // Ensure DOM is loaded before running scripts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
}

function initializeAll() {
    let themeCheckActive = false;
    
    // Define animation defaults
    CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");
    
    gsap.defaults({
        ease: "msc-ease",
        duration: 0.8
    });
    
    // Initialize Lenis
    const lenis = new Lenis({
        lerp: 0.1,
        smooth: true
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Initialize all components
    initScrollTriggers();
    initCheckTheme();
    stylesScrub();
    initVimeoBGVideo();
    initSliders();
    initTestimonial();
    initTabSystem();
    initCustomCursor();
}

// Rest of your functions here...

