import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Create custom ease
CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");

// Default animation settings
export const animationDefaults = {
    staggerDefault: 0.075,
    durationDefault: 0.8
};

// Set GSAP defaults
gsap.defaults({
    ease: "msc-ease",
    duration: animationDefaults.durationDefault
});

// Initialize ScrollTriggers
export function initScrollTriggers() {
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

// Initialize SplitText animation
export function initSplitTextAnimation() {
    gsap.registerPlugin(SplitText, ScrollTrigger);
    
    const targetText = document.querySelector("h2.h-display");

    if (targetText) {
        console.log("Target text elements found.");
        const split = new SplitText(targetText, { 
            type: "chars" 
        });

        const tl = gsap
            .timeline({
                scrollTrigger: {
                    trigger: ".split-text-scroll-trigger",
                    start: "top 15%",
                    end: "+=250%",
                    pin: true,
                    scrub: 1
                }
            })
            .set(split.chars, { color: "#bab9b9" })
            .to(split.chars, {
                color: "#161413",
                duration: 1,
                stagger: 0.1
            });
    }
} 