// Global dependencies
const { gsap, ScrollTrigger, CustomEase } = window;
const $ = window.jQuery;
const barba = window.barba;
const Lenis = window.Lenis;
const Swiper = window.Swiper;
const Player = window.Vimeo.Player;

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
    setupThumbnailHoverEffect();
    initBarba();
}

// Theme checking functions
function startThemeCheck() {
    if (!themeCheckActive) {
        document.addEventListener("scroll", checkThemeSection);
        themeCheckActive = true;
        console.log("Theme check started; listeners reattached.");
    }
}

function stopThemeCheck() {
    document.removeEventListener("scroll", checkThemeSection);
    themeCheckActive = false;
    console.log("Theme check stopped; listeners removed.");
}

// Styles scrub animation
function stylesScrub() {
    let cmsItems = $(".work_item");
    let sizeSmall = (1 / 3) * 100 + "%";
    let sizeLarge = (2 / 3) * 100 + "%";

    cmsItems.filter(":nth-child(odd)").each(function(index) {
        let oddItem = $(this);
        let evenItem = $(this).next();
        let row = $("<div class='work_row'></div>");
        let flex = $("<div class='work_flex'></div>");

        row.insertBefore(oddItem);
        flex.appendTo(row);
        oddItem.add(evenItem).appendTo(flex);

        let initialProgress = index % 2 !== 0 ? 1 : 0;

        gsap.matchMedia().add("(min-width: 992px)", () => {
            let progressObject = { value: initialProgress };
            let tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
            
            tl.fromTo(oddItem, { width: sizeLarge }, { width: sizeSmall });
            tl.fromTo(evenItem, { width: sizeSmall }, { width: sizeLarge }, "<");
            tl.from(oddItem.find(".work_image"), { scale: 1.2 }, "<");
            tl.to(evenItem.find(".work_image"), { scale: 1.2 }, "<");
            tl.progress(initialProgress);

            function setProgress(progressValue) {
                gsap.to(progressObject, {
                    value: progressValue,
                    ease: "sine.out",
                    duration: 0.4,
                    onUpdate: () => tl.progress(progressObject.value)
                });
            }

            row.on("mousemove", function(e) {
                let mousePercent = gsap.utils.normalize(0.2, 0.8, e.clientX / window.innerWidth);
                setProgress(mousePercent);
            });

            row.on("mouseleave", () => setProgress(initialProgress));
        });
    });
}

// Theme change timeline
function changeThemeTimeline(theme) {
    console.log('Changing theme to:', theme);
    const tl = gsap.timeline();
    
    tl.set("body", { attr: { "element-theme": theme } });
    tl.to("body", {
        backgroundColor: "var(--color--background)",
        duration: 0.5,
        ease: "power2.out"
    });

    return tl;
}

// ScrollTrigger initialization
function initScrollTriggers() {
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
        }
    });
}

// Theme checking initialization
function initCheckTheme() {
    function checkThemeSection() {
        const themeSections = document.querySelectorAll("[data-theme-section]");
        const navBar = document.querySelector('.nav_bar');
        const themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0;

        themeSections.forEach(function(themeSection) {
            const { top, bottom } = themeSection.getBoundingClientRect();
            if (top <= themeObserverOffset && bottom >= themeObserverOffset) {
                const themeSectionActive = themeSection.getAttribute('data-theme-section');
                changeThemeTimeline(themeSectionActive);
            }
        });
    }

    checkThemeSection();

    barba.hooks.beforeLeave(() => {
        stopThemeCheck();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    });

    barba.hooks.after(() => {
        console.log("After transition hook triggered.");
        checkThemeSection();
        startThemeCheck();
        console.log("Theme checked and listeners started post-transition.");
    });
}

// Vimeo background video
function initVimeoBGVideo() {
    const vimeoPlayers = document.querySelectorAll('[data-vimeo-bg]');
    
    vimeoPlayers.forEach(container => {
        const videoId = container.getAttribute('data-vimeo-bg');
        if (!videoId) return;

        const player = new Player(container, {
            id: videoId,
            background: true,
            loop: true,
            muted: true
        });

        function adjustVideoSizing() {
            const containerAspect = container.clientWidth / container.clientHeight;
            const videoAspect = 16 / 9;
            
            if (containerAspect > videoAspect) {
                container.style.width = '100%';
                container.style.height = `${(container.clientWidth / videoAspect)}px`;
            } else {
                container.style.width = `${container.clientHeight * videoAspect}px`;
                container.style.height = '100%';
            }
        }

        window.addEventListener('resize', adjustVideoSizing);
        adjustVideoSizing();
    });
}

// Slider initialization
function initSliders() {
    new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
}

// Testimonial functionality
function initTestimonial() {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });
}

// Tab system
function initTabSystem() {
    const tabButtons = document.querySelectorAll('[data-tab-button]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    let activeIndex = 0;
    let progressInterval;

    function startProgressBar(index) {
        const progressBar = tabButtons[index].querySelector('.tab-progress');
        if (!progressBar) return;

        gsap.set(progressBar, { width: '0%' });
        gsap.to(progressBar, {
            width: '100%',
            duration: 5,
            ease: 'none',
            onComplete: () => switchTab((index + 1) % tabButtons.length)
        });
    }

    function switchTab(index) {
        clearInterval(progressInterval);
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        tabButtons[index].classList.add('active');
        tabContents[index].classList.add('active');
        
        activeIndex = index;
        startProgressBar(index);
    }

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => switchTab(index));
    });

    if (tabButtons.length > 0) {
        switchTab(0);
    }
}

// Custom cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    const cursorInner = cursor.querySelector('.cursor-inner');
    const cursorCircle = cursor.querySelector('.cursor-circle');

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    
    let xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    // Hover states
    const hoverElements = document.querySelectorAll('a, button, [data-cursor], .swiper-button-prev, .swiper-button-next');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            if (element.hasAttribute('data-cursor')) {
                cursor.classList.add(element.getAttribute('data-cursor'));
            }
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            if (element.hasAttribute('data-cursor')) {
                cursor.classList.remove(element.getAttribute('data-cursor'));
            }
        });
    });
}

// Thumbnail hover effect
function setupThumbnailHoverEffect(containerSelector = '.thumbnail-container', thumbnailSelector = '.thumbnail', hoverImageSelector = '.hover-image') {
    const containers = document.querySelectorAll(containerSelector);
    
    containers.forEach(container => {
        const thumbnail = container.querySelector(thumbnailSelector);
        const hoverImage = container.querySelector(hoverImageSelector);
        
        if (!thumbnail || !hoverImage) return;

        container.addEventListener('mouseenter', () => {
            gsap.to(hoverImage, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        container.addEventListener('mouseleave', () => {
            gsap.to(hoverImage, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            gsap.to(hoverImage, {
                x: x,
                y: y,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    });
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
        views: [{
            namespace: 'home',
            beforeEnter(data) {
                stylesScrub();
                initVimeoBGVideo();
            },
            afterLeave(data) {
                // Cleanup if needed
            }
        }, {
            namespace: 'work',
            beforeEnter(data) {
                initSliders();
                setupThumbnailHoverEffect();
            },
            afterLeave(data) {
                // Cleanup if needed
            }
        }, {
            namespace: 'about',
            beforeEnter(data) {
                initTestimonial();
                initTabSystem();
            },
            afterLeave(data) {
                // Cleanup if needed
            }
        }, {
            namespace: 'contact',
            beforeEnter(data) {
                // Contact page specific initializations
            },
            afterLeave(data) {
                // Cleanup if needed
            }
        }]
    });
}

