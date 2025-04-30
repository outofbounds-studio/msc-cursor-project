// src/js/main.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import barba from '@barba/core';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Create custom ease
CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");

// Set GSAP defaults
gsap.defaults({
    ease: "msc-ease",
    duration: 0.8
});

// Initialize Lenis for smooth scrolling
let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Initialize cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    // Cursor movement
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Smooth cursor animation
    gsap.ticker.add(() => {
        const speed = 0.15;
        cursorX += (targetX - cursorX) * speed;
        cursorY += (targetY - cursorY) * speed;
        
        gsap.set(cursor, {
            left: cursorX,
            top: cursorY,
            xPercent: -50,
            yPercent: -50
        });
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-effect');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 1.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize text animations
function initTextAnimations() {
    const splitTextElements = document.querySelectorAll('.split-text-scroll-trigger');
    splitTextElements.forEach(element => {
        const chars = element.textContent.split('');
        element.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');
        
        gsap.from(element.querySelectorAll('.char'), {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
                markers: false
            },
            opacity: 0.2,
            stagger: 0.05,
            y: 100,
            ease: 'power4.out'
        });
    });
}

// Initialize sliders
function initSliders() {
    $(".slider-main_component").each(function(index) {
        let loopMode = $(this).attr("loop-mode") === "true";
        let sliderDuration = $(this).attr("slider-duration") ? 
            parseInt($(this).attr("slider-duration")) : 450;

        new Swiper($(this).find(".swiper")[0], {
            speed: sliderDuration,
            loop: loopMode,
            autoHeight: false,
            centeredSlides: loopMode,
            followFinger: true,
            freeMode: false,
            slideToClickedSlide: false,
            slidesPerView: 1,
            spaceBetween: "4%",
            rewind: false,
            mousewheel: { forceToAxis: true },
            keyboard: { enabled: true, onlyInViewport: true },
            breakpoints: {
                480: { slidesPerView: 1, spaceBetween: "4%" },
                768: { slidesPerView: 2, spaceBetween: "4%" },
                992: { slidesPerView: 3.5, spaceBetween: "1%" }
            },
            pagination: {
                el: $(this).find(".swiper-bullet-wrapper")[0],
                bulletActiveClass: "is-active",
                bulletClass: "swiper-bullet",
                bulletElement: "button",
                clickable: true
            },
            navigation: {
                nextEl: $(this).find(".swiper-next")[0],
                prevEl: $(this).find(".swiper-prev")[0],
                disabledClass: "is-disabled"
            },
            scrollbar: {
                el: $(this).find(".swiper-drag-wrapper")[0],
                draggable: true,
                dragClass: "swiper-drag",
                snapOnRelease: true
            },
            slideActiveClass: "is-active",
            slideDuplicateActiveClass: "is-active"
        });
    });
}

// Theme handling
function initThemeHandling() {
    const navBar = document.querySelector('.nav_bar');
    const navBarMidpoint = navBar ? navBar.offsetHeight / 2 : 0;

    ScrollTrigger.create({
        trigger: '[data-theme-section]',
        start: `top ${navBarMidpoint}px`,
        toggleActions: "play none none reverse",
        onEnter: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section');
            changeThemeTimeline(themeSectionActive);
        },
        onLeaveBack: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section');
            const oppositeTheme = themeSectionActive === 'dark' ? 'light' : 'dark';
            changeThemeTimeline(oppositeTheme);
        },
    });
}

function changeThemeTimeline(theme) {
    const tl = gsap.timeline();
    tl.set("body", { attr: { "element-theme": theme } });
    tl.to("body", { 
        backgroundColor: "var(--color--background)",
        duration: 0.5,
        ease: "power2.out"
    });
    return tl;
}

// Barba.js initialization
function initBarba() {
    barba.init({
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }],
        views: [
            {
                namespace: 'home',
                beforeEnter() {
                    initTextAnimations();
                    initThemeHandling();
                    initSliders();
                }
            },
            {
                namespace: 'about',
                beforeEnter() {
                    initThemeHandling();
                }
            },
            {
                namespace: 'work',
                beforeEnter() {
                    initThemeHandling();
                    initSliders();
                }
            },
            {
                namespace: 'styles',
                beforeEnter() {
                    initTextAnimations();
                    initThemeHandling();
                }
            }
        ]
    });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initCustomCursor();
    initTextAnimations();
    initBarba();
});