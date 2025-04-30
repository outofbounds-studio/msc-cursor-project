// Main application code
"use strict";

// Import page-specific functionality and site settings
import { initCurrentPage } from './pages';
import { initSiteSettings } from './site-settings';
import { gsap } from "gsap";
import SplitType from 'split-type';

// Webflow site-specific code
const webflowSiteInit = () => {
    // Initialize site settings from Webflow
    initSiteSettings();
    console.log('Site initialization started');
};

// Utility functions
const utils = {
    // Add any utility functions here
    isDevMode: () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    showDevIndicator: () => {
        if (utils.isDevMode()) {
            const indicator = document.createElement('div');
            indicator.style.position = 'fixed';
            indicator.style.bottom = '20px';
            indicator.style.right = '20px';
            indicator.style.padding = '10px';
            indicator.style.background = '#000';
            indicator.style.color = '#fff';
            indicator.style.borderRadius = '5px';
            indicator.style.zIndex = '9999';
            indicator.textContent = 'Development Mode';
            document.body.appendChild(indicator);
        }
    }
};

// Initialize everything when Webflow is ready
window.Webflow ||= [];
window.Webflow.push(() => {
    try {
        // Run site-wide initialization
        webflowSiteInit();
        
        // Initialize page-specific code
        initCurrentPage();
        
        // Show development indicator
        utils.showDevIndicator();
        
        // Initialize cursor
        const cursor = document.querySelector('.cursor');
        let cursorX = 0;
        let cursorY = 0;
        let targetX = 0;
        let targetY = 0;

        // Initialize text splitting
        const splitTextElements = document.querySelectorAll('.split-text-scroll-trigger');
        splitTextElements.forEach(element => {
            new SplitType(element, { types: 'chars' });
        });

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

        // Text animation on scroll
        const textAnimations = gsap.utils.toArray('.split-text-scroll-trigger').map(text => {
            const chars = text.querySelectorAll('.char');
            
            return gsap.from(chars, {
                scrollTrigger: {
                    trigger: text,
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
        
        console.log('All initialization complete');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}); 