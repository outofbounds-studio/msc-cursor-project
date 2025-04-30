import { gsap } from 'gsap';

// Function to create GSAP timeline for theme change
export function changeThemeTimeline(theme) {
    console.log('Changing theme to:', theme);
    const tl = gsap.timeline();
    
    // Set the theme attribute to trigger CSS variables
    tl.set("body", { attr: { "element-theme": theme } });

    // Animate the background color transition with easing
    tl.to("body", { 
        backgroundColor: "var(--color--background)",
        duration: 0.5,
        ease: "power2.out"
    });

    return tl;
}

// Theme checking functionality
let themeCheckActive = false;

export function startThemeCheck() {
    if (!themeCheckActive) {
        document.addEventListener("scroll", checkThemeSection);
        themeCheckActive = true;
        console.log("Theme check started; listeners reattached.");
    }
}

export function stopThemeCheck() {
    document.removeEventListener("scroll", checkThemeSection);
    themeCheckActive = false;
    console.log("Theme check stopped; listeners removed.");
}

function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");
    const navBar = document.querySelector('.nav_bar');
    const themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0;

    themeSections.forEach(function(themeSection) {
        const themeSectionTop = themeSection.getBoundingClientRect().top;
        const themeSectionBottom = themeSection.getBoundingClientRect().bottom;

        if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
            const themeSectionActive = themeSection.getAttribute('data-theme-section');
            changeThemeTimeline(themeSectionActive);
        }
    });
} 