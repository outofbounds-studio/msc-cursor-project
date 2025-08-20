// msc.js - Metal Staircase Co. Website Scripts
// Version: 1.0.2 updated 20/08/2025 15.55

(function() {
    console.log('msc-cursor.js script loaded and executing!');
    
    // === Global Menu State Management Functions ===
    let lastFocusedElement = null;
    
    function trapFocus(element) {
        const focusableSelectors = 'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableEls = element.querySelectorAll(focusableSelectors);
        if (!focusableEls.length) return;
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        lastFocusedElement = document.activeElement;
        function handleTab(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }
        element.addEventListener('keydown', handleTab);
        firstEl.focus();
        element._focusTrapHandler = handleTab;
    }
    
    function removeTrapFocus() {
        const menuOverlay = document.querySelector('.menu-overlay');
        if (menuOverlay && menuOverlay._focusTrapHandler) {
            menuOverlay.removeEventListener('keydown', menuOverlay._focusTrapHandler);
            menuOverlay._focusTrapHandler = null;
        }
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }
    
    function resetMenuState() {
        const menuOverlay = document.querySelector('.menu-overlay');
        const pageWrap = document.querySelector('.page_wrap');
        const navBar = document.querySelector('.nav_bar');
        
        if (menuOverlay && pageWrap && navBar) {
            console.log('🔄 Resetting menu state...');
            
            // Remove all menu-related classes
            menuOverlay.classList.remove('open');
            pageWrap.classList.remove('menu-open');
            navBar.classList.remove('hide');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            // Reset GSAP transforms with more aggressive cleanup
            if (typeof gsap !== 'undefined') {
                gsap.set(pageWrap, { 
                    y: 0, 
                    scale: 1,
                    clearProps: "all" // Clear all GSAP properties
                });
                gsap.set(menuOverlay, { 
                    y: 0, 
                    opacity: 0,
                    clearProps: "all" // Clear all GSAP properties
                });
                
                // Reset menu content position using GSAP
                const menuContent = menuOverlay.querySelector('.menu_content');
                if (menuContent) {
                    // Use GSAP to reset position
                    gsap.set(menuContent, { 
                        y: -100,
                        clearProps: "all" // Clear all GSAP properties
                    });
                }
            }
            
            // Force a reflow to ensure changes take effect
            pageWrap.offsetHeight;
            menuOverlay.offsetHeight;
            const menuContent = menuOverlay.querySelector('.menu_content');
            if (menuContent) menuContent.offsetHeight;
            
            // Remove focus trap
            removeTrapFocus();
            
            console.log('✅ Menu state reset complete');
        }
    }
    
    // Load required scripts dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Load CSS files dynamically
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Load all required dependencies
    async function loadDependencies() {
        const dependencies = [
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
            'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js',
            'https://player.vimeo.com/api/player.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
            'https://cdn.jsdelivr.net/gh/flowtricks/scripts@v1.0.4/variables-color-scroll.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js',
            'https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd.min.js',
            'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrambleTextPlugin.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js'
        ];

        try {
            await Promise.all(dependencies.map(src => loadScript(src)));
            // Register all GSAP plugins after loading
            if (typeof gsap !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Flip);
            }
            console.log('All dependencies loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading dependencies:', error);
            return false;
        }
    }

    // Load Slater scripts and styles based on environment
    function loadSlaterScripts() {
        const isWebflow = window.location.host.includes("webflow.io");
        const baseUrl = isWebflow ? "https://slater.app/13164" : "https://assets.slater.app/slater/13164";

        return Promise.all([
            // Load JavaScript files
            loadScript(`${baseUrl}.js${isWebflow ? '' : '?v=1.0'}`)       // Metal Staircase Co
        ]);
    }

    // Main initialization function
    async function init() {
        console.log('Starting initialization...');
        // 1. Wait for all dependencies
        const dependenciesLoaded = await loadDependencies();
        console.log('Dependencies loaded:', dependenciesLoaded);
        if (!dependenciesLoaded) {
            console.error('Failed to load dependencies');
            return;
        }

        // 2. Wait for Slater scripts (SplitText, etc)
        console.log('Loading Slater scripts...');
        await loadSlaterScripts();
        console.log('Slater scripts loaded');

        // 3. Now all libraries are loaded, safe to use barba, SplitText, etc
        console.log('Initializing GSAP defaults...');
        utils.initGSAPDefaults();
        
        // Initialize menu system now that GSAP is available
        initMenu();
        
        console.log('Initializing Lenis...');
        utils.lenis.init();
        console.log('Initializing theme system...');
        utils.theme.init();
        console.log('Initializing Barba...');
        barba.init(barbaConfig);

        // ---- Barba.js Hooks (must be after barba.init) ----
        barba.hooks.leave((data) => {
            console.log('Barba leave hook triggered');
            utils.lenis.destroy();
        });

        // Global Barba hook to run on every page transition
        barba.hooks.afterEnter((data) => {
            console.log('Barba afterEnter hook triggered', data);
            console.log('Barba namespace:', data.next && data.next.namespace);
            console.log('Initializing animations...');
            initMaskTextScrollReveal();
            initScrambleText();
            initSpecLineReveal();
            wrapFirstWordInSpan();
            initDividerLineReveal();
            
            // Only run form validation on pages that have forms
            const hasForms = document.querySelectorAll('[data-form-validate]').length > 0;
            if (hasForms) {
                console.log('Forms detected, running form validation...');
                components.initAdvancedFormValidation();
                console.log('components.initAdvancedFormValidation() called');
            } else {
                console.log('No forms detected, skipping form validation');
            }
            
            // Reset menu state on page transitions
            resetMenuState();
            
            console.log('All animations initialized');
            setTimeout(() => {
                console.log('About to call Jetboost.ReInit() in Barba afterEnter hook (with delay)');
                if (window.Jetboost && typeof Jetboost.ReInit === 'function') {
                    Jetboost.ReInit();
                    console.log('Jetboost.ReInit() called in Barba afterEnter hook (with delay)');
                } else {
                    console.warn('Jetboost.ReInit() is not available in Barba afterEnter hook');
                }
            }, 200);
            console.log('REMINDER: Check that Jetboost markup is present in the DOM after transition.');
        });

        

        // Initialize page-specific functions for direct page loads (not through Barba)
        function initPageSpecificFunctions() {
            const currentNamespace = barba.current?.namespace;
            console.log('Initializing page-specific functions for namespace:', currentNamespace);
            
            if (currentNamespace === 'style-item') {
                console.log('Initializing style-item specific functions');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                components.initSliders();
                components.initTestimonial();
                components.initModalBasic();
                components.initAccordionCSS();
                initNumberTickerAnimation();
                initScrambleText();
            } else if (currentNamespace === 'work-item') {
                console.log('Initializing work-item specific functions');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                animations.stylesScrub();
                components.initSliders();
                components.initTestimonial();
                components.initTabSystem();
                components.initAccordionCSS();
                initNumberTickerAnimation();
                initScrambleText();
            } else if (currentNamespace === 'news-item') {
                console.log('Initializing news-item specific functions');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                components.initModalBasic();
                components.initAccordionCSS();
                initScrambleText();
            } else if (currentNamespace === 'faqs') {
                console.log('Initializing faqs specific functions');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initAccordionCSS();
                initFilterBasic();
            }
        }

        // Call page-specific initialization after a short delay to ensure DOM is ready
        setTimeout(initPageSpecificFunctions, 100);

        // Add Jetboost.ReInit() to Barba enter hook with logging
        barba.hooks.enter((data) => {
            console.log('About to call Jetboost.ReInit() in Barba enter hook');
            if (window.Jetboost && typeof Jetboost.ReInit === 'function') {
                Jetboost.ReInit();
                console.log('Jetboost.ReInit() called in Barba enter hook');
            } else {
                console.warn('Jetboost.ReInit() is not available in Barba enter hook');
            }
        });

        console.log('Checking GSAP plugins...');
        console.log('GSAP:', typeof gsap !== 'undefined' ? 'Loaded' : 'Not loaded');
        console.log('ScrollTrigger:', typeof ScrollTrigger !== 'undefined' ? 'Loaded' : 'Not loaded');
        console.log('SplitText:', typeof SplitText !== 'undefined' ? 'Loaded' : 'Not loaded');
        
        // Only run form validation on pages that have forms
        const hasForms = document.querySelectorAll('[data-form-validate]').length > 0;
        if (hasForms) {
            console.log('Forms detected in main init, running form validation...');
            components.initAdvancedFormValidation();
            console.log('components.initAdvancedFormValidation() called in main init');
        } else {
            console.log('No forms detected in main init, skipping form validation');
        }
        
        console.log('Initialization complete');
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


    // Core Utilities
    const utils = {
        // Lenis Manager
        lenis: {
            instance: null,
            init() {
                this.instance = new Lenis({
                    lerp: 0.1,
                    smooth: true
                });
                window.lenis = this.instance;
                this.raf();
            },
            raf(time) {
                this.instance?.raf(time);
                requestAnimationFrame(this.raf.bind(this));
            },
            destroy() {
                this.instance?.destroy();
                this.instance = null;
            }
        },
    
        // GSAP Defaults
        initGSAPDefaults() {
            CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");
            gsap.defaults({
                ease: "msc-ease",
                duration: 0.8
            });
        },
    
        // Error Handler
        handleError(component, error) {
            console.error(`Error in ${component}:`, error);
        },

        // Theme Manager
        theme: {
            current: 'dark',
            isTransitioning: false,
            defaultThemes: {
                'home': 'dark',
                'about': 'light',
                'work': 'dark',
                'styles': 'dark',
                'work-item': 'dark',
                'style-item': 'dark',
                'news-item': 'dark'
            },

            init() {
                // Set initial theme based on current namespace
                const currentNamespace = barba.current?.namespace || 'home';
                const initialTheme = this.defaultThemes[currentNamespace] || 'dark';
                this.set(initialTheme, false); // Set without animation on init
                
                // Initialize scroll-based theme changes
                this.initScrollTriggers();
                
                // Add Barba hooks for theme management
                barba.hooks.beforeLeave(() => {
                    this.isTransitioning = true;
                    // Kill all theme-related ScrollTriggers
                    ScrollTrigger.getAll().forEach(trigger => {
                        if (trigger.vars.trigger?.hasAttribute('data-theme-section')) {
                            trigger.kill();
                        }
                    });
                });
                
                barba.hooks.afterEnter((data) => {
                    const newTheme = this.defaultThemes[data.next.namespace] || 'dark';
                    this.set(newTheme, true);
                    this.isTransitioning = false;
                    // Reinitialize scroll triggers after transition
                    this.initScrollTriggers();
                });
            },

            set(theme, animate = true) {
                if (this.current === theme || !theme) return;
                
                console.log(`[Theme] Changing theme to: ${theme}`);
                this.current = theme;
                
                if (animate && !this.isTransitioning) {
                    this.animateThemeChange(theme);
                } else {
                    // Direct set without animation
                    document.body.setAttribute('element-theme', theme);
                    document.body.style.backgroundColor = `var(--color--background-${theme})`;
                }
            },

            animateThemeChange(theme) {
                const tl = gsap.timeline({
                    onStart: () => {
                        document.body.setAttribute('element-theme', theme);
                    },
                    onComplete: () => {
                        console.log(`[Theme] Theme change complete: ${theme}`);
                    }
                });

                tl.to('body', {
                    backgroundColor: `var(--color--background-${theme})`,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            },

            initScrollTriggers() {
                // Kill any existing theme ScrollTriggers
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.vars.trigger?.hasAttribute('data-theme-section')) {
                        trigger.kill();
                    }
                });

                const navBar = document.querySelector('.nav_bar');
                const navBarMidpoint = navBar ? navBar.offsetHeight / 2 : 0;
                const sections = document.querySelectorAll('[data-theme-section]');
                
                console.log('[Theme] Initializing scroll triggers:', {
                    navBarMidpoint,
                    sectionsFound: sections.length
                });

                sections.forEach(section => {
                    const theme = section.getAttribute('data-theme-section');
                    console.log('[Theme] Creating trigger for section:', {
                        section,
                        theme
                    });

                    ScrollTrigger.create({
                        trigger: section,
                        start: `top ${navBarMidpoint}px`,
                        toggleActions: 'play none none reverse',
                        onEnter: (self) => {
                            if (this.isTransitioning) return;
                            const theme = self.trigger.getAttribute('data-theme-section');
                            console.log('[Theme] Scroll trigger onEnter:', theme);
                            this.set(theme);
                        },
                        onLeaveBack: (self) => {
                            if (this.isTransitioning) return;
                            const theme = self.trigger.getAttribute('data-theme-section');
                            const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
                            console.log('[Theme] Scroll trigger onLeaveBack:', oppositeTheme);
                            this.set(oppositeTheme);
                        }
                    });
                });
            }
        },
    };
    
    // Animation Functions
    const animations = {
        stylesScrub() {
            try {
                let cmsItems = $(".work_item");
                console.log('stylesScrub called, found .work_item:', cmsItems.length);
                let sizeSmall = (1 / 3) * 100 + "%";
                let sizeLarge = (2 / 3) * 100 + "%";
    
                cmsItems.filter(":nth-child(odd)").each(function (index) {
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
    
                        row.on("mousemove", function (e) {
                            let mousePercent = e.clientX / window.innerWidth;
                            mousePercent = gsap.utils.normalize(0.2, 0.8, mousePercent);
                            setProgress(mousePercent);
                        });
    
                        row.on("mouseleave", function (e) {
                            setProgress(initialProgress);
                        });
                    });
                });
            } catch (error) {
                utils.handleError('stylesScrub', error);
            }
        },
    
        initSplitTextAnimation() {
            try {
                const splitTextPluginUrl = "https://slater.app/13164/35586.js";
                const targetText = document.querySelector("h2.h-display");
    
                if (!targetText) {
                    console.error("Target text elements not found");
                    return;
                }
    
                const split = new SplitText(targetText, { type: "chars" });
    
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".split-text-scroll-trigger",
                        start: "top 15%",
                        end: "+=250%",
                        pin: true,
                        scrub: 1,
                        markers: false
                    }
                })
                .set(split.chars, { color: "#bab9b9" })
                .to(split.chars, {
                    color: "#161413",
                    duration: 1,
                    stagger: 0.1
                });
            } catch (error) {
                utils.handleError('initSplitTextAnimation', error);
            }
        }
    };
    
    // Component Initializers
    const components = {
        initSliders() {
            try {
                const sliders = $(".slider-main_component");
                console.log('initSliders called, found .slider-main_component:', sliders.length);
                sliders.each(function (index) {
                    let loopMode = $(this).attr("loop-mode") === "true";
                    let sliderDuration = $(this).attr("slider-duration") !== undefined ? 
                        +$(this).attr("slider-duration") : 450;
    
                    const swiper = new Swiper($(this).find(".swiper")[0], {
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
                        mousewheel: {
                            forceToAxis: true
                        },
                        keyboard: {
                            enabled: true,
                            onlyInViewport: true
                        },
                        breakpoints: {
                            480: {
                                slidesPerView: 1,
                                spaceBetween: "4%"
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: "4%"
                            },
                            992: {
                                slidesPerView: 3.5,
                                spaceBetween: "1%"
                            }
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
            } catch (error) {
                utils.handleError('initSliders', error);
            }
        },
    
        initTestimonial() {
            try {
                const testimonials = $(".slider-testimonial_component");
                console.log('initTestimonial called, found .slider-testimonial_component:', testimonials.length);
                testimonials.each(function (index) {
                    let loopMode = $(this).attr("loop-mode") === "true";
                    let sliderDuration = $(this).attr("slider-duration") !== undefined ? 
                        +$(this).attr("slider-duration") : 450;
    
                    const swiper = new Swiper($(this).find(".swiper")[0], {
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
                        mousewheel: {
                            forceToAxis: true
                        },
                        keyboard: {
                            enabled: true,
                            onlyInViewport: true
                        },
                        breakpoints: {
                            480: {
                                slidesPerView: 1,
                                spaceBetween: "4%"
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: "4%"
                            },
                            992: {
                                slidesPerView: 4,
                                spaceBetween: "1%"
                            }
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
                        slideDuplicateActiveClass: "is-active",
                        on: {
                            slideChange: function () {
                                this.slides.forEach(slide => {
                                    slide.classList.remove('is-active');
                                });
                                this.slides[this.activeIndex].classList.add('is-active');
                            }
                        }
                    });
                });
            } catch (error) {
                utils.handleError('initTestimonial', error);
            }
        },
    
        initTabSystem() {
            try {
                const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
                console.log('initTabSystem called, found [data-tabs="wrapper"]:', wrappers.length);
                
                wrappers.forEach((wrapper) => {
                    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
                    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
                    
                    const autoplay = wrapper.dataset.tabsAutoplay === "true";
                    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
                    
                    let activeContent = null;
                    let activeVisual = null;
                    let isAnimating = false;
                    let progressBarTween = null;
    
                    function startProgressBar(index) {
                        if (progressBarTween) progressBarTween.kill();
                        const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
                        if (!bar) return;
                        
                        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
                        progressBarTween = gsap.to(bar, {
                            scaleX: 1,
                            duration: autoplayDuration / 1000,
                            ease: "power1.inOut",
                            onComplete: () => {
                                if (!isAnimating) {
                                    const nextIndex = (index + 1) % contentItems.length;
                                    switchTab(nextIndex);
                                }
                            }
                        });
                    }
    
                    function switchTab(index) {
                        if (isAnimating || contentItems[index] === activeContent) return;
                        
                        isAnimating = true;
                        if (progressBarTween) progressBarTween.kill();
                        
                        const outgoingContent = activeContent;
                        const outgoingVisual = activeVisual;
                        const outgoingBar = outgoingContent?.querySelector('[data-tabs="item-progress"]');
                        
                        const incomingContent = contentItems[index];
                        const incomingVisual = visualItems[index];
                        const incomingBar = incomingContent.querySelector('[data-tabs="item-progress"]');
                        
                        const tl = gsap.timeline({
                            defaults: { duration: 0.65, ease: "power3" },
                            onComplete: () => {
                                activeContent = incomingContent;
                                activeVisual = incomingVisual;
                                isAnimating = false;
                                if (autoplay) startProgressBar(index);
                            }
                        });
                        
                        if (outgoingContent) {
                            outgoingContent.classList.remove("active");
                            outgoingVisual?.classList.remove("active");
                            tl.set(outgoingBar, { transformOrigin: "right center" })
                              .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
                              .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
                              .to(outgoingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, 0);
                        }
    
                        incomingContent.classList.add("active");
                        incomingVisual.classList.add("active");
                        tl.fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, 0.3)
                          .fromTo(incomingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, { height: "auto" }, 0)
                          .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
                    }
    
                    switchTab(0);
                    
                    contentItems.forEach((item, i) =>
                        item.addEventListener("click", () => {
                            if (item === activeContent) return;
                            switchTab(i);
                        })
                    );
                });
            } catch (error) {
                utils.handleError('initTabSystem', error);
            }
        },
    
        initCustomCursor() {
            try {
                let cursorItem = document.querySelector(".cursor");
                let cursorParagraph = cursorItem.querySelector("p");
                let targets = document.querySelectorAll("[data-cursor]");
                let xOffset = 12;
                let yOffset = 75;
                let cursorIsOnRight = false;
                let currentTarget = null;
                let lastText = '';
    
                gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });
    
                let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
                let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });
    
                window.addEventListener("mousemove", (e) => {
                    let windowWidth = window.innerWidth;
                    let windowHeight = window.innerHeight;
                    let scrollY = window.scrollY;
                    let cursorX = e.clientX;
                    let cursorY = e.clientY + scrollY;
    
                    let xPercent = xOffset;
                    let yPercent = yOffset;
    
                    if (cursorX > windowWidth * 0.81) {
                        cursorIsOnRight = true;
                        xPercent = -100;
                    } else {
                        cursorIsOnRight = false;
                    }
    
                    if (cursorY > scrollY + windowHeight * 0.9) {
                        yPercent = -120;
                    }
    
                    if (currentTarget) {
                        let newText = currentTarget.getAttribute("data-cursor");
                        if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
                            newText = currentTarget.getAttribute("data-easteregg");
                        }
    
                        if (newText !== lastText) {
                            cursorParagraph.innerHTML = newText;
                            lastText = newText;
                        }
                    }
    
                    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
                    xTo(cursorX);
                    yTo(cursorY - scrollY);
                });
    
                targets.forEach(target => {
                    target.addEventListener("mouseenter", () => {
                        currentTarget = target;
                        let newText = target.hasAttribute("data-easteregg")
                            ? target.getAttribute("data-easteregg")
                            : target.getAttribute("data-cursor");
    
                        if (newText !== lastText) {
                            cursorParagraph.innerHTML = newText;
                            lastText = newText;
                        }
                    });
                });
            } catch (error) {
                utils.handleError('initCustomCursor', error);
            }
        },
    
        initAccordionCSS() {
            console.log('initAccordionCSS called');
            const accordions = document.querySelectorAll('[data-accordion-css-init]');
            console.log('Found accordions:', accordions.length);
    
            accordions.forEach((accordion) => {
                accordion.removeEventListener('click', accordion._accordionClickHandler);
    
                accordion._accordionClickHandler = function(event) {
                    const toggle = event.target.closest('[data-accordion-toggle]');
                    if (!toggle) return;
                    console.log('Accordion toggle clicked!', toggle);
    
                    const singleAccordion = toggle.closest('[data-accordion-status]');
                    if (!singleAccordion) return;
    
                    const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
                    singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
    
                    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';
                    if (closeSiblings && !isActive) {
                        const activeSiblings = accordion.querySelectorAll('[data-accordion-status="active"]');
                        activeSiblings.forEach((sibling) => {
                            if (sibling !== singleAccordion) {
                                sibling.setAttribute('data-accordion-status', 'not-active');
                            }
                        });
                    }
                };
    
                accordion.addEventListener('click', accordion._accordionClickHandler);
            });
        },
    
        initModalBasic() {
            try {
                const modalGroup = document.querySelector('[data-modal-group-status]');
                const modals = document.querySelectorAll('[data-modal-name]');
                const modalTargets = document.querySelectorAll('[data-modal-target]');
    
                modalTargets.forEach((modalTarget) => {
                    modalTarget.addEventListener('click', function () {
                        const modalTargetName = this.getAttribute('data-modal-target');
    
                        modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
                        modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));
    
                        document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
                        document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
    
                        if (modalGroup) {
                            modalGroup.setAttribute('data-modal-group-status', 'active');
                        }
    
                        if (window.lenis) window.lenis.stop();
                    });
                });
    
                document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
                    closeBtn.addEventListener('click', () => {
                        modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
                        if (modalGroup) {
                            modalGroup.setAttribute('data-modal-group-status', 'not-active');
                        }
                        if (window.lenis) window.lenis.start();
                    });
                });
    
                document.addEventListener('keydown', function (event) {
                    if (event.key === 'Escape') {
                        modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
                        if (modalGroup) {
                            modalGroup.setAttribute('data-modal-group-status', 'not-active');
                        }
                        if (window.lenis) window.lenis.start();
                    }
                });
            } catch (error) {
                utils.handleError('initModalBasic', error);
            }
        },
    
        initVimeoBGVideo() {
            try {
                const vimeoPlayers = document.querySelectorAll('[data-vimeo-bg-init]');
                console.log('initVimeoBGVideo called, found [data-vimeo-bg-init]:', vimeoPlayers.length);
    
                vimeoPlayers.forEach(function(vimeoElement, index) {
                    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
                    if (!vimeoVideoID) return;
                    
                    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=1&loop=1&muted=1`;
                    vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);
    
                    const videoIndexID = 'vimeo-player-index-' + index;
                    vimeoElement.setAttribute('id', videoIndexID);
    
                    const player = new Vimeo.Player(videoIndexID);
                    player.setVolume(0);
                    
                    player.on('bufferend', function() {
                        vimeoElement.setAttribute('data-vimeo-activated', 'true');
                        vimeoElement.setAttribute('data-vimeo-loaded', 'true');
                    });
                    
                    let videoAspectRatio;
                    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
                        player.getVideoWidth().then(function(width) {
                            player.getVideoHeight().then(function(height) {
                                videoAspectRatio = height / width;
                                const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
                                if (beforeEl) {
                                    beforeEl.style.paddingTop = videoAspectRatio * 100 + '%';
                                }
                            });
                        });
                    }
    
                    function adjustVideoSizing() {
                        const containerAspectRatio = (vimeoElement.offsetHeight / vimeoElement.offsetWidth) * 100;
                        const iframeWrapper = vimeoElement.querySelector('.vimeo-bg__iframe-wrapper');
                        
                        if (iframeWrapper && videoAspectRatio) {
                            if (containerAspectRatio > videoAspectRatio * 100) {
                                iframeWrapper.style.width = `${(containerAspectRatio / (videoAspectRatio * 100)) * 100}%`;
                            } else {
                                iframeWrapper.style.width = '';
                            }
                        }
                    }
    
                    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
                        adjustVideoSizing();
                        player.getVideoWidth().then(function() {
                            player.getVideoHeight().then(function() {
                                adjustVideoSizing();
                            });
                        });
                    } else {
                        adjustVideoSizing();
                    }
    
                    window.addEventListener('resize', adjustVideoSizing);
                });
            } catch (error) {
                utils.handleError('initVimeoBGVideo', error);
            }
        },
    
        setupThumbnailHoverEffect(containerSelector, thumbnailSelector, hoverImageSelector) {
            try {
                const thumbnailContainers = document.querySelectorAll(containerSelector);
    
                thumbnailContainers.forEach(thumbnailContainer => {
                    const thumbnail = thumbnailContainer.querySelector(thumbnailSelector);
                    const hoverImage = thumbnailContainer.querySelector(hoverImageSelector);
    
                    if (thumbnail && hoverImage) {
                        gsap.set(hoverImage, { opacity: 0, pointerEvents: "none" });
    
                        thumbnailContainer.addEventListener('mouseenter', () => {
                            gsap.to(hoverImage, { duration: 0.5, opacity: 1, pointerEvents: "auto", ease: "power2.out" });
                            gsap.to(thumbnail, { duration: 0.5, opacity: 0, ease: "power2.out" });
                        });
    
                        thumbnailContainer.addEventListener('mouseleave', () => {
                            gsap.to(hoverImage, { duration: 0.3, opacity: 0, pointerEvents: "none", ease: "power2.out" });
                            gsap.to(thumbnail, { duration: 0.3, opacity: 1, ease: "power2.out" });
                        });
                    }
                });
            } catch (error) {
                utils.handleError('setupThumbnailHoverEffect', error);
            }
        },

        initAdvancedFormValidation() {
            console.log('initAdvancedFormValidation function called!');
            try {
                console.log('=== Form Validation Debug ===');
                const forms = document.querySelectorAll('[data-form-validate]');
                console.log('Forms with data-form-validate:', forms.length);

                forms.forEach((formContainer, index) => {
                    console.log(`Processing form ${index + 1}:`, formContainer);
                    const startTime = new Date().getTime();

                    const form = formContainer.querySelector('form');
                    if (!form) {
                        console.log(`Form ${index + 1}: No form element found`);
                        return;
                    }
                    console.log(`Form ${index + 1}: Form element found:`, form);

                    const validateFields = form.querySelectorAll('[data-validate]');
                    console.log(`Form ${index + 1}: Fields with data-validate:`, validateFields.length);

                    const dataSubmit = form.querySelector('[data-submit]');
                    if (!dataSubmit) {
                        console.log(`Form ${index + 1}: No data-submit element found`);
                        return;
                    }
                    console.log(`Form ${index + 1}: data-submit element found:`, dataSubmit);

                    const realSubmitInput = dataSubmit.querySelector('input[type="submit"]');
                    if (!realSubmitInput) {
                        console.log(`Form ${index + 1}: No submit input found in data-submit`);
                        return;
                    }
                    console.log(`Form ${index + 1}: Submit input found:`, realSubmitInput);

                    function isSpam() {
                        const currentTime = new Date().getTime();
                        return currentTime - startTime < 5000;
                    }

                    // Disable select options with invalid values on page load
                    validateFields.forEach(function (fieldGroup) {
                        const select = fieldGroup.querySelector('select');
                        if (select) {
                            const options = select.querySelectorAll('option');
                            options.forEach(function (option) {
                                if (
                                    option.value === '' ||
                                    option.value === 'disabled' ||
                                    option.value === 'null' ||
                                    option.value === 'false'
                                ) {
                                    option.setAttribute('disabled', 'disabled');
                                }
                            });
                        }
                    });

                    function validateAndStartLiveValidationForAll() {
                        console.log(`Form ${index + 1}: Starting validation for all fields`);
                        let allValid = true;
                        let firstInvalidField = null;

                        validateFields.forEach(function (fieldGroup, fieldIndex) {
                            const input = fieldGroup.querySelector('input, textarea, select');
                            const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
                            if (!input && !radioCheckGroup) {
                                console.log(`Form ${index + 1}, Field ${fieldIndex + 1}: No input or radio group found`);
                                return;
                            }

                            if (input) {
                                input.__validationStarted = true;
                                console.log(`Form ${index + 1}, Field ${fieldIndex + 1}: Input found:`, input.type, input.name);
                            }
                            if (radioCheckGroup) {
                                radioCheckGroup.__validationStarted = true;
                                const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                                inputs.forEach(function (input) {
                                    input.__validationStarted = true;
                                });
                                console.log(`Form ${index + 1}, Field ${fieldIndex + 1}: Radio/checkbox group found with ${inputs.length} inputs`);
                            }

                            updateFieldStatus(fieldGroup);

                            if (!isValid(fieldGroup)) {
                                allValid = false;
                                if (!firstInvalidField) {
                                    firstInvalidField = input || radioCheckGroup.querySelector('input');
                                }
                                console.log(`Form ${index + 1}, Field ${fieldIndex + 1}: Validation failed`);
                            } else {
                                console.log(`Form ${index + 1}, Field ${fieldIndex + 1}: Validation passed`);
                            }
                        });

                        if (!allValid && firstInvalidField) {
                            firstInvalidField.focus();
                        }

                        console.log(`Form ${index + 1}: Overall validation result:`, allValid);
                        return allValid;
                    }

                    function isValid(fieldGroup) {
                        const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
                        if (radioCheckGroup) {
                            const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                            const checkedInputs = radioCheckGroup.querySelectorAll('input:checked');
                            const min = parseInt(radioCheckGroup.getAttribute('min')) || 1;
                            const max = parseInt(radioCheckGroup.getAttribute('max')) || inputs.length;
                            const checkedCount = checkedInputs.length;

                            if (inputs[0].type === 'radio') {
                                return checkedCount >= 1;
                            } else {
                                if (inputs.length === 1) {
                                    return inputs[0].checked;
                                } else {
                                    return checkedCount >= min && checkedCount <= max;
                                }
                            }
                        } else {
                            const input = fieldGroup.querySelector('input, textarea, select');
                            if (!input) return false;

                            let valid = true;
                            const min = parseInt(input.getAttribute('min')) || 0;
                            const max = parseInt(input.getAttribute('max')) || Infinity;
                            const value = input.value.trim();
                            const length = value.length;

                            if (input.tagName.toLowerCase() === 'select') {
                                if (
                                    value === '' ||
                                    value === 'disabled' ||
                                    value === 'null' ||
                                    value === 'false'
                                ) {
                                    valid = false;
                                }
                            } else if (input.type === 'email') {
                                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                valid = emailPattern.test(value);
                            } else {
                                if (input.hasAttribute('min') && length < min) valid = false;
                                if (input.hasAttribute('max') && length > max) valid = false;
                            }

                            return valid;
                        }
                    }

                    function updateFieldStatus(fieldGroup) {
                        const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
                        if (radioCheckGroup) {
                            const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                            const checkedInputs = radioCheckGroup.querySelectorAll('input:checked');

                            if (checkedInputs.length > 0) {
                                fieldGroup.classList.add('is--filled');
                            } else {
                                fieldGroup.classList.remove('is--filled');
                            }

                            const valid = isValid(fieldGroup);

                            if (valid) {
                                fieldGroup.classList.add('is--success');
                                fieldGroup.classList.remove('is--error');
                            } else {
                                fieldGroup.classList.remove('is--success');
                                const anyInputValidationStarted = Array.from(inputs).some(input => input.__validationStarted);
                                if (anyInputValidationStarted) {
                                    fieldGroup.classList.add('is--error');
                                } else {
                                    fieldGroup.classList.remove('is--error');
                                }
                            }
                        } else {
                            const input = fieldGroup.querySelector('input, textarea, select');
                            if (!input) return;

                            const value = input.value.trim();

                            if (value) {
                                fieldGroup.classList.add('is--filled');
                            } else {
                                fieldGroup.classList.remove('is--filled');
                            }

                            const valid = isValid(fieldGroup);

                            if (valid) {
                                fieldGroup.classList.add('is--success');
                                fieldGroup.classList.remove('is--error');
                            } else {
                                fieldGroup.classList.remove('is--success');
                                if (input.__validationStarted) {
                                    fieldGroup.classList.add('is--error');
                                } else {
                                    fieldGroup.classList.remove('is--error');
                                }
                            }
                        }
                    }

                    validateFields.forEach(function (fieldGroup) {
                        const input = fieldGroup.querySelector('input, textarea, select');
                        const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');

                        if (radioCheckGroup) {
                            const inputs = radioCheckGroup.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                            inputs.forEach(function (input) {
                                input.__validationStarted = false;

                                input.addEventListener('change', function () {
                                    requestAnimationFrame(function () {
                                        if (!input.__validationStarted) {
                                            const checkedCount = radioCheckGroup.querySelectorAll('input:checked').length;
                                            const min = parseInt(radioCheckGroup.getAttribute('min')) || 1;

                                            if (checkedCount >= min) {
                                                input.__validationStarted = true;
                                            }
                                        }

                                        if (input.__validationStarted) {
                                            updateFieldStatus(fieldGroup);
                                        }
                                    });
                                });

                                input.addEventListener('blur', function () {
                                    input.__validationStarted = true;
                                    updateFieldStatus(fieldGroup);
                                });
                            });
                        } else if (input) {
                            input.__validationStarted = false;

                            if (input.tagName.toLowerCase() === 'select') {
                                input.addEventListener('change', function () {
                                    input.__validationStarted = true;
                                    updateFieldStatus(fieldGroup);
                                });
                            } else {
                                input.addEventListener('input', function () {
                                    const value = input.value.trim();
                                    const length = value.length;
                                    const min = parseInt(input.getAttribute('min')) || 0;
                                    const max = parseInt(input.getAttribute('max')) || Infinity;

                                    if (!input.__validationStarted) {
                                        if (input.type === 'email') {
                                            if (isValid(fieldGroup)) input.__validationStarted = true;
                                        } else {
                                            if (
                                                (input.hasAttribute('min') && length >= min) ||
                                                (input.hasAttribute('max') && length <= max)
                                            ) {
                                                input.__validationStarted = true;
                                            }
                                        }
                                    }

                                    if (input.__validationStarted) {
                                        updateFieldStatus(fieldGroup);
                                    }
                                });

                                input.addEventListener('blur', function () {
                                    input.__validationStarted = true;
                                    updateFieldStatus(fieldGroup);
                                });
                            }
                        }
                    });

                    dataSubmit.addEventListener('click', function () {
                        console.log(`Form ${index + 1}: Submit button clicked`);
                        if (validateAndStartLiveValidationForAll()) {
                            console.log(`Form ${index + 1}: Validation passed, checking spam protection`);
                            if (isSpam()) {
                                console.log(`Form ${index + 1}: Spam protection triggered`);
                                alert('Form submitted too quickly. Please try again.');
                                return;
                            }
                            console.log(`Form ${index + 1}: Triggering form submission`);
                            realSubmitInput.click();
                        } else {
                            console.log(`Form ${index + 1}: Validation failed`);
                        }
                    });

                    form.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
                            event.preventDefault();
                            console.log(`Form ${index + 1}: Enter key pressed`);
                            if (validateAndStartLiveValidationForAll()) {
                                if (isSpam()) {
                                    console.log(`Form ${index + 1}: Spam protection triggered (Enter key)`);
                                    alert('Form submitted too quickly. Please try again.');
                                    return;
                                }
                                console.log(`Form ${index + 1}: Triggering form submission (Enter key)`);
                                realSubmitInput.click();
                            } else {
                                console.log(`Form ${index + 1}: Validation failed (Enter key)`);
                            }
                        }
                    });
                });
            } catch (error) {
                utils.handleError('initAdvancedFormValidation', error);
            }
        }
    };
    
    // Page-Specific Logic
    const pages = {
        home: {
            beforeEnter() {
                console.log('[Barba] home.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering home page...");
            },
            afterEnter() {
                console.log('[Barba] home.afterEnter');
                animations.stylesScrub();
                components.initVimeoBGVideo();
                components.initSliders();
                components.initTestimonial();
                components.initTabSystem();
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                initScrambleText();
                initHeroParallax();
            },
            afterLeave() {
                console.log('[Barba] home.afterLeave');
                console.log("Leaving home page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        about: {
            beforeEnter() {
                console.log('[Barba] about.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering about page...");
            },
            afterEnter() {
                console.log('[Barba] about.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initTabSystem();
                components.initAccordionCSS();
                components.initModalBasic();
                initNumberTickerAnimation();
            },
            afterLeave() {
                console.log('[Barba] about.afterLeave');
                console.log("Leaving about page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        // Collection List Pages (formerly static pages)
        work: {
            beforeEnter() {
                console.log('[Barba] work.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering Work collection list page...");
            },
            afterEnter() {
                const currentNamespace = (barba && barba.current && barba.current.namespace) || 'unknown';
                const nextNamespace = (barba && barba.history && barba.history.current && barba.history.current.namespace) || 'unknown';
                console.log('[Barba] work.afterEnter triggered');
                console.log('[Barba] current namespace:', currentNamespace);
                console.log('[Barba] next namespace:', nextNamespace);
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                initScrambleText();
                setTimeout(() => {
                    // Webflow Tabs re-initialization (Work page only, if tabs exist)
                    function waitForTabsWrapperAndRedraw(maxWait = 3000) {
                        const selector = '.w-tabs';
                        const interval = 100;
                        let waited = 0;

                        function tryRedraw() {
                            const tabsWrapper = document.querySelector(selector);
                            if (tabsWrapper) {
                                console.log('Tabs wrapper found, running redraw');
                                if (window.Webflow) {
                                    console.log('Webflow object is present');
                                    if (Webflow.require) {
                                        const tabsModule = Webflow.require('tabs');
                                        if (tabsModule && typeof tabsModule.redraw === 'function') {
                                            console.log('Webflow tabs module and redraw function are available');
                                            Webflow.destroy();
                                            Webflow.ready();
                                            tabsModule.redraw();
                                        } else {
                                            console.warn('Webflow tabs module or redraw function not available:', tabsModule);
                                        }
                                    } else {
                                        console.warn('Webflow.require is not available');
                                    }
                                } else {
                                    console.warn('Webflow object is not present');
                                }
                            } else if (waited < maxWait) {
                                waited += interval;
                                setTimeout(tryRedraw, interval);
                            } else {
                                console.warn('Tabs wrapper not found after waiting, skipping tabs.redraw');
                            }
                        }

                        tryRedraw();
                    }
                    waitForTabsWrapperAndRedraw();
                }, 1000);
            },
            afterLeave() {
                console.log('[Barba] work.afterLeave');
                console.log("Leaving Work collection list page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        styles: {
            beforeEnter() {
                console.log('[Barba] styles.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering Styles collection list page...");
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                }
            },
            afterEnter() {
                console.log('[Barba] styles.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                initScrambleText();
                animations.stylesScrub();

            },
            afterLeave() {
                console.log('[Barba] styles.afterLeave');
                console.log("Leaving Styles collection list page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        news: {
            beforeEnter() {
                console.log('[Barba] news.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering News collection list page...");
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                }
            },
            afterEnter() {
                console.log('[Barba] news.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                initScrambleText();
            },
            afterLeave() {
                console.log('[Barba] news.afterLeave');
                console.log("Leaving News collection list page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        // Individual Item Pages
        'work-item': {
            beforeEnter() {
                console.log('[Barba] work-item.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering Work Item page...");
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                }
            },
            afterEnter() {
                console.log('[Barba] work-item.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                animations.stylesScrub();
                components.initSliders();
                components.initTabSystem();
                components.initAccordionCSS();
                initNumberTickerAnimation();
                initScrambleText();
                console.log('Initializing lightbox for work-item page');
                const galleryWrappers = document.querySelectorAll('[data-gallery]');
                console.log('Found gallery wrappers:', galleryWrappers.length);
                galleryWrappers.forEach((wrapper, index) => {
                    console.log(`Creating lightbox for gallery ${index + 1}:`, wrapper);
                    createLightbox(wrapper, {
                        // onStart: () => window.lenis?.stop(), // Temporarily commented out to test lightbox
                        onOpen: () => {},
                        // onClose: () => window.lenis?.start(), // Temporarily commented out to test lightbox
                        onCloseComplete: () => {}
                    });
                });
            },
            afterLeave() {
                console.log('[Barba] work-item.afterLeave');
                console.log("Leaving Work Item page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        'style-item': {
            beforeEnter() {
                console.log('[Barba] style-item.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering Style Item page...");
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                }
            },
            afterEnter() {
                console.log('[Barba] style-item.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                components.initSliders();
                components.initModalBasic();
                components.initAccordionCSS();
                initNumberTickerAnimation();
                initScrambleText();
            },
            afterLeave() {
                console.log('[Barba] style-item.afterLeave');
                console.log("Leaving Style Item page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        'news-item': {
            beforeEnter() {
                console.log('[Barba] news-item.beforeEnter');
                utils.theme.set('dark', false);
                console.log("Entering News Item page...");
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                }
            },
            afterEnter() {
                console.log('[Barba] news-item.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initVimeoBGVideo();
                components.initModalBasic();
                components.initAccordionCSS();
                initScrambleText();
            },
            afterLeave() {
                console.log('[Barba] news-item.afterLeave');
                console.log("Leaving News Item page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        },
        
        faqs: {
            beforeEnter() {
                console.log('[Barba] faqs.beforeEnter');
                // Add any theme logic if needed
            },
            afterEnter() {
                console.log('[Barba] faqs.afterEnter');
                components.initCustomCursor();
                animations.initSplitTextAnimation();
                components.initAccordionCSS();
                initFilterBasic();
            },
            afterLeave() {
                console.log('[Barba] faqs.afterLeave');
                console.log("Leaving faqs page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                document.querySelectorAll('[data-split="heading"]').forEach(heading => {
                    if (heading._splitText) {
                        heading._splitText.revert();
                        heading._splitText = null;
                    }
                });
            }
        }
    };
    
    // Barba.js Configuration
    const barbaConfig = {
        transitions: [{
            name: 'global-transition',
            async leave(data) {
                // Stop Lenis before transition
                if (window.lenis) window.lenis.stop();
                
                const tl = gsap.timeline();
                tl.to(data.current.container, { 
                    autoAlpha: 0, 
                    duration: 0.5,
                    onComplete: () => {
                        data.current.container.remove();
                    }
                });
                return tl;
            },
            async enter(data) {
                // Always scroll to top when entering a new page
                window.scrollTo(0, 0);
                
                const tl = gsap.timeline();
                tl.from(data.next.container, { 
                    autoAlpha: 0, 
                    duration: 0.5,
                    onComplete: () => {
                        if (window.lenis) {
                            utils.lenis.init();
                        }
                    }
                });
                return tl;
            }
        }],
        views: [
            // Static page views (home and about)
            ...Object.entries(pages).filter(([key]) => 
                ['home', 'about'].includes(key)
            ).map(([namespace, handlers]) => ({
                namespace,
                beforeEnter() {
                    // Ensure scroll to top before entering any page
                    window.scrollTo(0, 0);
                    if (handlers.beforeEnter) handlers.beforeEnter();
                },
                afterEnter: handlers.afterEnter,
                afterLeave: handlers.afterLeave
            })),
            // Collection list views (work, styles, news)
            {
                namespace: 'work',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages.work.beforeEnter) pages.work.beforeEnter();
                },
                afterEnter: pages.work.afterEnter,
                afterLeave: pages.work.afterLeave
            },
            {
                namespace: 'styles',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages.styles.beforeEnter) pages.styles.beforeEnter();
                },
                afterEnter: pages.styles.afterEnter,
                afterLeave: pages.styles.afterLeave
            },
            {
                namespace: 'news',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages.news.beforeEnter) pages.news.beforeEnter();
                },
                afterEnter: pages.news.afterEnter,
                afterLeave: pages.news.afterLeave
            },
            // Individual item views
            {
                namespace: 'work-item',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages['work-item'].beforeEnter) pages['work-item'].beforeEnter();
                },
                afterEnter: pages['work-item'].afterEnter,
                afterLeave: pages['work-item'].afterLeave
            },
            {
                namespace: 'style-item',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages['style-item'].beforeEnter) pages['style-item'].beforeEnter();
                },
                afterEnter: pages['style-item'].afterEnter,
                afterLeave: pages['style-item'].afterLeave
            },
            {
                namespace: 'news-item',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages['news-item'].beforeEnter) pages['news-item'].beforeEnter();
                },
                afterEnter: pages['news-item'].afterEnter,
                afterLeave: pages['news-item'].afterLeave
            },
            {
                namespace: 'faqs',
                beforeEnter() {
                    window.scrollTo(0, 0);
                    if (pages.faqs.beforeEnter) pages.faqs.beforeEnter();
                },
                afterEnter: pages.faqs.afterEnter,
                afterLeave: pages.faqs.afterLeave
            }
        ]
    };

    // SplitText/ScrollTrigger heading animation
    function initMaskTextScrollReveal() {
        if (typeof SplitText === 'undefined') {
            return;
        }
        if (typeof ScrollTrigger === 'undefined') {
            return;
        }
        const headings = document.querySelectorAll('[data-split="heading"]');
        headings.forEach(heading => {
            if (heading._splitText) {
                heading._splitText.revert();
            }
            gsap.set(heading, { autoAlpha: 1 });
            const type = heading.dataset.splitReveal || 'lines';
            const typesToSplit =
                type === 'lines' ? ['lines'] :
                type === 'words' ? ['lines','words'] :
                ['lines','words','chars'];
            heading._splitText = SplitText.create(heading, {
                type: typesToSplit.join(', '),
                mask: 'lines',
                autoSplit: true,
                linesClass: 'line',
                wordsClass: 'word',
                charsClass: 'letter',
                onSplit: function(instance) {
                    animate(instance, heading, type);
                }
            });
        });
        function animate(instance, heading, type) {
            const splitConfig = {
                lines: { duration: 0.8, stagger: 0.08 },
                words: { duration: 0.6, stagger: 0.06 },
                chars: { duration: 0.4, stagger: 0.01 }
            };
            const targets = instance[type];
            const config = splitConfig[type];
            const isHero = heading.hasAttribute('data-split-hero');
            const triggerStart = isHero ? 'top 98%' : 'top 80%';
            gsap.from(targets, {
                y: 100,
                opacity: 0,
                duration: config.duration,
                stagger: config.stagger,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: heading,
                    start: triggerStart,
                    once: true
                }
            });
        }
    }

    // === GSAP Number Ticker Animation with ScrollTrigger and Dynamic Digit Width ===
    function setDigitWidth(digitEl, digit) {
        // Create a temporary span to measure the digit width
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.whiteSpace = 'pre';
        temp.textContent = digit;

        // Copy computed styles from the digitEl
        const computed = window.getComputedStyle(digitEl);
        temp.style.font = computed.font;
        temp.style.fontSize = computed.fontSize;
        temp.style.fontWeight = computed.fontWeight;
        temp.style.fontFamily = computed.fontFamily;
        temp.style.letterSpacing = computed.letterSpacing;
        temp.style.fontStyle = computed.fontStyle;
        temp.style.textTransform = computed.textTransform;
        temp.style.lineHeight = computed.lineHeight;

        document.body.appendChild(temp);
        const width = temp.offsetWidth;
        document.body.removeChild(temp);
        digitEl.style.width = width + 'px';
    }

    function animateNumberTicker(el) {
        const finalValue = parseInt(el.getAttribute('data-animate-number'), 10);
        const duration = parseFloat(el.getAttribute('data-animate-duration')) || 1.2;
        const digits = finalValue.toString().length;
        el.innerHTML = '';
        const lastDigits = Array(digits).fill('0');
        for (let i = 0; i < digits; i++) {
            const digitSpan = document.createElement('span');
            digitSpan.className = 'digit';
            digitSpan.innerHTML = `
                <span class="digit-inner">
                    <span class="digit-old">0</span>
                    <span class="digit-new">0</span>
                </span>
            `;
            el.appendChild(digitSpan);
            setDigitWidth(digitSpan, '0'); // Set initial width
        }
        let obj = { value: 0 };
        gsap.to(obj, {
            value: finalValue,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
                let current = Math.floor(obj.value).toString().padStart(digits, '0');
                let next = Math.ceil(obj.value).toString().padStart(digits, '0');
                el.querySelectorAll('.digit').forEach((digitEl, i) => {
                    const inner = digitEl.querySelector('.digit-inner');
                    const oldDigitSpan = inner.querySelector('.digit-old');
                    const newDigitSpan = inner.querySelector('.digit-new');
                    const oldDigit = lastDigits[i];
                    const currentDigit = current[i];
                    const nextDigit = next[i];

                    if (currentDigit !== oldDigit) {
                        oldDigitSpan.textContent = oldDigit;
                        newDigitSpan.textContent = currentDigit;
                        setDigitWidth(digitEl, currentDigit); // Dynamically set width
                        gsap.fromTo(inner, 
                            { y: '0em' }, 
                            { 
                                y: '-1em', 
                                duration: 0.3, 
                                ease: "power2.out", 
                                delay: i * 0.12,
                                onComplete: () => {
                                    oldDigitSpan.textContent = currentDigit;
                                    newDigitSpan.textContent = currentDigit;
                                    gsap.set(inner, { y: '0em' });
                                }
                            }
                        );
                        lastDigits[i] = currentDigit;
                    } else {
                        // Always ensure width is correct for rolling effect
                        setDigitWidth(digitEl, currentDigit);
                    }
                });
            }
        });
    }

    function initNumberTickerAnimation() {
        document.querySelectorAll('[data-animate-number]').forEach(el => {
            // Hide by default
            el.style.opacity = 0;
            ScrollTrigger.create({
                trigger: el,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    el.style.opacity = 1;
                    animateNumberTicker(el);
                }
            });
        });
    }

    // === Scramble Text Utilities ===
    const scramble = {
        onLoad() {
            let targets = document.querySelectorAll('[data-scramble="load"]');
            targets.forEach((target) => {
                // split into separate words + letters
                let split = new SplitText(target, {
                    type: "words, chars",
                    wordsClass: "word",
                    charsClass: "char"
                });
                gsap.to(split.words, {
                    duration: 1.2,
                    stagger: 0.01,
                    scrambleText: {
                        text: "{original}",
                        chars: 'upperCase',
                        speed: 0.85,
                    },
                    onComplete: () => split.revert()
                });
            });
        },
        onScroll() {
            let targets = document.querySelectorAll('[data-scramble="scroll"]');
            targets.forEach((target) => {
                let isAlternative = target.hasAttribute("data-scramble-alt");
                let split = new SplitText(target, {
                    type: "words, chars",
                    wordsClass: "word",
                    charsClass: "char"
                });
                gsap.to(split.words, {
                    duration: 1.4,
                    stagger: 0.015,
                    scrambleText: {
                        text: "{original}",
                        chars: isAlternative ? '<▯>|' : 'upperCase',
                        speed: 0.95,
                    },
                    scrollTrigger: {
                        trigger: target,
                        start: "top bottom",
                        once: true
                    },
                    onComplete: () => split.revert()
                });
            });
        },
        onHover() {
            let targets = document.querySelectorAll('[data-scramble-hover="link"]');
            targets.forEach((target) => {
                let textEl = target.querySelector('[data-scramble-hover="target"]');
                if (!textEl) return;
                let originalText = textEl.textContent;
                let customHoverText = textEl.getAttribute("data-scramble-text");
                let split = new SplitText(textEl, {
                    type: "words, chars",
                    wordsClass: "word",
                    charsClass: "char"
                });
                target.addEventListener("mouseenter", () => {
                    gsap.to(textEl, {
                        duration: 1,
                        scrambleText: {
                            text: customHoverText ? customHoverText : originalText,
                            chars: "◊▯∆|"
                        }
                    });
                });
                target.addEventListener("mouseleave", () => {
                    gsap.to(textEl, {
                        duration: 0.6,
                        scrambleText: {
                            text: originalText,
                            speed: 2,
                            chars: "◊▯∆"
                        }
                    });
                });
            });
        }
    };

    function initScrambleText() {
        scramble.onLoad();
        scramble.onScroll();
        scramble.onHover();
    }

    // Parallax effect for hero heading (adjusted for Webflow classes)
    function initHeroParallax() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        const heading = document.querySelector('.home-hero .h-display');
        if (!heading) return;
        gsap.to(heading, {
            y: () => window.innerWidth < 768 ? 0 : -100, // less movement on mobile
            ease: "none",
            scrollTrigger: {
                trigger: ".home-hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Force lightbox centering function
    function forceLightboxCentering() {
      console.log('🔍 forceLightboxCentering function called!');
      
      const lightboxWrap = document.querySelector('.lightbox-wrap.is-active');
      console.log('🔍 lightboxWrap found:', !!lightboxWrap);
      
      if (lightboxWrap) {
        const lightboxImgWrap = lightboxWrap.querySelector('.lightbox-img__wrap');
        console.log('🔍 lightboxImgWrap found:', !!lightboxImgWrap);
        console.log('🔍 lightboxImgWrap element:', lightboxImgWrap);
        
        if (lightboxImgWrap) {
          console.log('🔍 Setting styles on lightboxImgWrap...');
          lightboxImgWrap.style.display = 'flex';
          lightboxImgWrap.style.alignItems = 'center';
          lightboxImgWrap.style.justifyContent = 'center';
          lightboxImgWrap.style.width = '90vw';
          lightboxImgWrap.style.height = 'calc(100svh - 10em)';
          
          console.log('🔍 Styles set. Current styles:', {
            display: lightboxImgWrap.style.display,
            alignItems: lightboxImgWrap.style.alignItems,
            justifyContent: lightboxImgWrap.style.justifyContent,
            width: lightboxImgWrap.style.width,
            height: lightboxImgWrap.style.height
          });
        } else {
          console.log('❌ lightboxImgWrap not found!');
        }
      } else {
        console.log('❌ lightboxWrap not found!');
      }
    }

    // Lightbox function
    function createLightbox(container, {
      onStart,
      onOpen,
      onClose,
      onCloseComplete
    } = {}) {
      console.log('createLightbox called with container:', container);
      const elements = {
        wrapper: container.querySelector('[data-lightbox="wrapper"]'),
        triggers: container.querySelectorAll('[data-lightbox="trigger"]'),
        triggerParents: container.querySelectorAll('[data-lightbox="trigger-parent"]'),
        items: container.querySelectorAll('[data-lightbox="item"]'),
        nav: container.querySelectorAll('[data-lightbox="nav"]'),
        counter: {
          current: container.querySelector('[data-lightbox="counter-current"]'),
          total: container.querySelector('[data-lightbox="counter-total"]')
        },
        buttons: {
          prev: container.querySelector('[data-lightbox="prev"]'),
          next: container.querySelector('[data-lightbox="next"]'),
          close: container.querySelector('[data-lightbox="close"]')
        }
      };
      
      console.log('Lightbox elements found:', {
        wrapper: !!elements.wrapper,
        triggers: elements.triggers.length,
        triggerParents: elements.triggerParents.length,
        items: elements.items.length,
        nav: elements.nav.length,
        counter: {
          current: !!elements.counter.current,
          total: !!elements.counter.total
        },
        buttons: {
          prev: !!elements.buttons.prev,
          next: !!elements.buttons.next,
          close: !!elements.buttons.close
        }
      });
      const mainTimeline = gsap.timeline();
      if (elements.counter.total) {
        elements.counter.total.textContent = elements.triggers.length;
      }
      function closeLightbox() {
        onClose?.();
        mainTimeline.clear();
        gsap.killTweensOf([
          elements.wrapper, 
          elements.nav, 
          elements.triggerParents, 
          elements.items,
          container.querySelector('[data-lightbox="original"]')
        ]);
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            elements.wrapper.classList.remove('is-active');
            elements.items.forEach(item => {
              item.classList.remove('is-active');
              const lightboxImage = item.querySelector('img');
              if (lightboxImage) {
                lightboxImage.style.display = '';
              }
            });
            const originalImg = container.querySelector('[data-lightbox="original"]');
            if (originalImg) { gsap.set(originalImg, { clearProps: "all" });}
            const originalParent = container.querySelector('[data-lightbox="original-parent"]');
            if (originalParent) { originalParent.parentElement.style.removeProperty('height'); }
            onCloseComplete?.();
          }
        });
        const originalItem = container.querySelector('[data-lightbox="original"]');
        const originalParent = container.querySelector('[data-lightbox="original-parent"]');
        if (originalItem && originalParent) {
          gsap.set(originalItem, { clearProps: "all" });
          originalParent.appendChild(originalItem);
          originalParent.removeAttribute('data-lightbox');
          originalItem.removeAttribute('data-lightbox');
        }
        let activeLightboxSlide = container.querySelector('[data-lightbox="item"].is-active')
        tl.to(elements.triggerParents, {
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.03,
          overwrite: true
        })
        .to(elements.nav, {
          autoAlpha: 0,
          y: "1rem",
          duration: 0.4,
          stagger: 0
        },"<")
        .to(elements.wrapper, {
          backgroundColor: "rgba(0,0,0,0)",
          duration: 0.4
        }, "<")
        .to(activeLightboxSlide,{
          autoAlpha:0,
          duration: 0.4,
        },"<")
        .set([elements.items, activeLightboxSlide, elements.triggerParents],  { clearProps: "all" })
        mainTimeline.add(tl);
      }
      function handleOutsideClick(event) {
        if (event.detail === 0) {
          return;
        }
        const clickedElement = event.target;
        const isOutside = !clickedElement.closest('[data-lightbox="item"].is-active img, [data-lightbox="nav"], [data-lightbox="close"], [data-lightbox="trigger"]');
        if (isOutside) {
          closeLightbox();
        }
      }
      function updateActiveItem(index) {
        elements.items.forEach(item => item.classList.remove('is-active'));
        elements.items[index].classList.add('is-active');
        if (elements.counter.current) {
          elements.counter.current.textContent = index + 1;
        }
      }
      elements.triggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (event) => {
          event.preventDefault();
          onStart?.();
          mainTimeline.clear();
          gsap.killTweensOf([
            elements.wrapper, 
            elements.nav, 
            elements.triggerParents
          ]);
          // Special handling for text link triggers (no image inside)
          const img = trigger.querySelector("img");
          if (!img) {
            // If no image, open the first lightbox item (index 0)
            updateActiveItem(0);
            container.addEventListener('click', handleOutsideClick);
            elements.wrapper.classList.add('is-active');
            
            // Force centering after lightbox opens
            setTimeout(() => {
              forceLightboxCentering();
            }, 100);
            // Animate background and nav just like the image trigger
            const tl = gsap.timeline({
              onComplete: () => {
                onOpen?.();
              }
            });
            tl.to(elements.wrapper, {
              backgroundColor: "rgba(0,0,0,0.8)",
              duration: 0.6
            }, 0)
            .fromTo(elements.nav, {
              autoAlpha: 0,
              y: "1rem"
            }, {
              autoAlpha: 1,
              y: "0rem",
              duration: 0.6,
              stagger: { each: 0.05, from: "center" }
            }, 0.2);
            mainTimeline.add(tl);
            return;
          }
          const state = Flip.getState(img);
          const triggerRect = trigger.getBoundingClientRect();
          trigger.parentElement.style.height = `${triggerRect.height}px`;
          trigger.setAttribute('data-lightbox', 'original-parent');
          img.setAttribute('data-lightbox', 'original');
          updateActiveItem(index);
          container.addEventListener('click', handleOutsideClick);
          const tl = gsap.timeline({
            onComplete: () => {
              onOpen?.();
            }
          });
          elements.wrapper.classList.add('is-active');
          
          // Force centering after lightbox opens
          setTimeout(() => {
            forceLightboxCentering();
          }, 100);
          
          const targetItem = elements.items[index];
          const lightboxImage = targetItem ? targetItem.querySelector('img') : null;
          if (lightboxImage) {
            lightboxImage.style.display = 'none';
          }
          elements.triggerParents.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
              gsap.to(otherTrigger, {
                autoAlpha: 0,
                duration: 0.4,
                stagger:0.02,
                overwrite: true
              });
            }
          });
          if (targetItem && !targetItem.contains(img)) {
            targetItem.appendChild(img);
            tl.add(
              Flip.from(state, {
                targets: img,
                absolute: true,
                duration: 0.6,
                ease: "power2.inOut"
              }), 0
            );
          }
          tl.to(elements.wrapper, {
            backgroundColor: "rgba(0,0,0,0.8)",
            duration: 0.6
          }, 0)
          .fromTo(elements.nav, {
            autoAlpha: 0,
            y: "1rem"
          }, {
            autoAlpha: 1,
            y: "0rem",
            duration: 0.6,
            stagger: { each: 0.05, from: "center" }
          }, 0.2);
          mainTimeline.add(tl);
        });
      });
      if (elements.buttons.next) {
        elements.buttons.next.addEventListener('click', () => {
          const currentIndex = Array.from(elements.items).findIndex(item => 
            item.classList.contains('is-active')
          );
          const nextIndex = (currentIndex + 1) % elements.items.length;
          updateActiveItem(nextIndex);
        });
      }
      if (elements.buttons.prev) {
        elements.buttons.prev.addEventListener('click', () => {
          const currentIndex = Array.from(elements.items).findIndex(item => 
            item.classList.contains('is-active')
        );
        const prevIndex = (currentIndex - 1 + elements.items.length) % elements.items.length;
          updateActiveItem(prevIndex);
        });
      }
      if (elements.buttons.close) {
        elements.buttons.close.addEventListener('click', closeLightbox);
      }
      document.addEventListener('keydown', (event) => {
        if (!elements.wrapper.classList.contains('is-active')) return;
        switch (event.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowRight':
            elements.buttons.next?.click();
            break;
          case 'ArrowLeft':
            elements.buttons.prev?.click();
            break;
        }
      });
    }

    // Animate .spec-line divs from 0% to 100% width, staggered, on scroll
    function initSpecLineReveal() {
        // Animate in .spec-container
        document.querySelectorAll('.spec-container').forEach(container => {
            const lines = container.querySelectorAll('.spec-line');
            if (!lines.length) return;
            gsap.set(lines, { width: '0%' });
            gsap.to(lines, {
                width: '100%',
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        // Animate in .line-container
        document.querySelectorAll('.line-container').forEach(container => {
            const lines = container.querySelectorAll('.spec-line');
            if (!lines.length) return;
            gsap.set(lines, { width: '0%' });
            gsap.to(lines, {
                width: '100%',
                duration: 0.7,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    once: true
                }
            });
        });
    }

    // Animate .divider-line divs from 0% to 100% width, staggered, on scroll
    function initDividerLineReveal() {
        // Find all divider lines
        document.querySelectorAll('.divider-line').forEach((line, index) => {
            // Set initial state
            gsap.set(line, { width: '0%' });
            
            // Create animation
            gsap.to(line, {
                width: '100%',
                duration: 1.4,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 80%',
                    once: true
                }
            });
        });
    }

    // Utility: Indent first word of paragraphs with .indent-first-word
    function wrapFirstWordInSpan() {
        document.querySelectorAll('.indent-first-word').forEach(p => {
            // Only run if not already wrapped
            if (!p.querySelector('.first-word')) {
                const words = p.innerHTML.trim().split(' ');
                if (words.length > 0) {
                    words[0] = `<span class="first-word">${words[0]}</span>`;
                    p.innerHTML = words.join(' ');
                }
            }
        });
    }

    // Basic Filter Functionality for FAQs
    function initFilterBasic() {
        const groups = document.querySelectorAll('[data-filter-group]');

        groups.forEach((group) => {
            const buttons = group.querySelectorAll('[data-filter-target]');
            const items = group.querySelectorAll('[data-filter-name]');
            const transitionDelay = 300;

            // Function to update the status and accessibility attributes of items
            const updateStatus = (element, shouldBeActive) => {
                element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
                element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
            };

            const handleFilter = (target) => {
                items.forEach((item) => {
                    const shouldBeActive = target === 'all' || item.getAttribute('data-filter-name') === target;
                    const currentStatus = item.getAttribute('data-filter-status');
                    if (currentStatus === 'active') {
                        item.setAttribute('data-filter-status', 'transition-out');
                        setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
                    } else {
                        setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
                    }
                });
                buttons.forEach((button) => {
                    const isActive = button.getAttribute('data-filter-target') === target;
                    button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
                    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });
            };

            buttons.forEach((button) => {
                button.addEventListener('click', () => {
                    const target = button.getAttribute('data-filter-target');
                    if (button.getAttribute('data-filter-status') === 'active') return;
                    handleFilter(target);
                });
            });

            // === Default to a specific filter by name ===
            const defaultTarget = 'design-styles'; // Change this value to your desired default filter
            const defaultButton = Array.from(buttons).find(btn => btn.getAttribute('data-filter-target') === defaultTarget);
            if (defaultButton) {
                handleFilter(defaultTarget);
            }
        });
    }
    
    // === Global Menu Overlay Logic ===
    function initMenu() {
        console.log('🔍 Initializing menu system...');
        
        // Selectors
        const burgerBtn = document.querySelector('.burger_wrap');
        const navBar = document.querySelector('.nav_bar');
        const pageWrap = document.querySelector('.page_wrap');
        const menuOverlay = document.querySelector('.menu-overlay');
        const closeMenuBtn = document.querySelector('.close-menu');

        if (!burgerBtn || !navBar || !pageWrap || !menuOverlay) {
            console.warn('⚠️ Menu elements not found, skipping menu initialization');
            return;
        }

        // Add backdrop blur (in case not set in CSS)
        menuOverlay.style.backdropFilter = 'blur(8px)';
        menuOverlay.style.webkitBackdropFilter = 'blur(8px)';
        
        // Ensure GSAP is available
        if (typeof gsap === 'undefined') {
            console.error('GSAP is not loaded. Menu animations will not work.');
            return;
        }
        
        console.log('✅ GSAP available, setting up menu functions...');



        // Function to initialize menu state (called on page load)
        function initMenuState() {
            if (menuOverlay && pageWrap && navBar) {
                console.log('🔄 Initializing menu state...');
                
                // Call global resetMenuState to ensure complete cleanup
                resetMenuState();
                
                console.log('✅ Menu state initialized');
            }
        }

        function closeMenu() {
        console.log('🔍 closeMenu function called');
        
        // Prevent multiple simultaneous calls
        if (pageWrap.classList.contains('closing')) {
            console.log('⚠️ Menu already closing, ignoring duplicate call');
            return;
        }
        
        pageWrap.classList.add('closing');
        
        // Hide menu overlay immediately when closing starts
        menuOverlay.classList.remove('open');
        
        // Reset menu overlay position to hide it
        gsap.set(menuOverlay, { y: 0, opacity: 0 });
        
        // Reset menu content position using GSAP
        const menuContent = menuOverlay.querySelector('.menu_content');
        if (menuContent) {
            console.log('🔄 Resetting menu content position');
            // Use GSAP to reset position
            gsap.set(menuContent, { y: -100 });
        }
        
        // Animate page content, menu overlay, and menu content back to original positions
        gsap.timeline()
            .to(pageWrap, {
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.inOut"
            }, 0)
            .to(menuOverlay, {
                y: -100, // Menu overlay slides back up
                opacity: 0, // Fade out
                duration: 0.7, // Same duration as page animation
                ease: "power2.inOut"
            }, 0)
            .to(menuContent, {
                y: -100, // Menu content slides back up
                duration: 0.7, // Same duration as page animation
                ease: "power2.inOut"
            }, 0)
            .call(() => {
                // Clean up after animation completes
                pageWrap.classList.remove('menu-open');
                pageWrap.classList.remove('closing');
                pageWrap.style.transform = '';
                console.log('✅ Menu close animation complete');
            });
        
        // Hide nav and restore body scroll
        navBar.classList.remove('hide');
        document.body.style.overflow = '';
        removeTrapFocus();
    }

    function openMenu() {
        console.log('🔍 openMenu function called');
        
        // Prevent opening while closing
        if (pageWrap.classList.contains('closing')) {
            console.log('⚠️ Menu is closing, waiting for close to complete');
            return;
        }
        
        // Prevent opening if already open
        if (menuOverlay.classList.contains('open')) {
            console.log('⚠️ Menu already open, ignoring duplicate call');
            return;
        }
        
        // First, prepare the menu overlay (hidden behind page content)
        menuOverlay.classList.add('open');
        navBar.classList.add('hide');
        pageWrap.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        trapFocus(menuOverlay);
        
        // Ensure menu overlay and content are properly positioned for animation
        gsap.set(menuOverlay, { 
            y: -100, // Start off-screen
            opacity: 0, // Start invisible
            pointerEvents: 'auto' // Enable clicking on menu content
        });
        
        const menuContent = menuOverlay.querySelector('.menu_content');
        if (menuContent) {
            // Set initial position for GSAP animation
            gsap.set(menuContent, { y: -100 });
        }
        
        // Wait a frame to ensure menu is visible and has dimensions
        requestAnimationFrame(() => {
            // Get menu height for the animation
            const menuHeight = menuOverlay.offsetHeight;
            console.log('🔍 Menu height:', menuHeight);
            
            // Debug: Check current page wrap state
            console.log('🔍 Page wrap current state:', {
                y: pageWrap.style.transform,
                classes: pageWrap.className,
                gsapProps: gsap.getProperty(pageWrap, "y"),
                scale: gsap.getProperty(pageWrap, "scale")
            });
            
            // Debug: Check if GSAP is working
            console.log('🔍 GSAP status:', {
                gsapLoaded: typeof gsap !== 'undefined',
                pageWrapElement: !!pageWrap,
                menuOverlayElement: !!menuOverlay
            });
            
            if (menuHeight === 0) {
                console.warn('⚠️ Menu height is 0, using fallback height');
                // Use a fallback height if menu height is 0
                const fallbackHeight = window.innerHeight * 0.8; // 80% of viewport height
                
                // Use GSAP timeline for synchronized animations
                gsap.timeline()
                    .to(menuOverlay, {
                        y: 0, // Menu overlay slides down
                        opacity: 1, // Fade in smoothly
                        duration: 0.7, // Same duration as page animation
                        ease: "power2.inOut"
                    }, 0)
                    .to(pageWrap, {
                        y: fallbackHeight,
                        scale: 0.98,
                        duration: 0.7, // Page animation
                        ease: "power2.inOut"
                    }, 0)
                    .to(menuContent, {
                        y: 0, // Menu content slides down
                        duration: 0.7, // Same duration as page animation
                        ease: "power2.inOut"
                    }, 0); // All animations start together
            } else {
                console.log('✅ Using actual menu height for animation');
                // Use GSAP timeline for synchronized animations
                gsap.timeline()
                    .to(menuOverlay, {
                        y: 0, // Menu overlay slides down
                        opacity: 1, // Fade in smoothly
                        duration: 0.7, // Same duration as page animation
                        ease: "power2.inOut"
                    }, 0)
                    .to(pageWrap, {
                        y: menuHeight,
                        scale: 0.98,
                        duration: 0.7, // Page animation
                        ease: "power2.inOut"
                    }, 0)
                    .to(menuContent, {
                        y: 0, // Menu content slides down
                        duration: 0.7, // Same duration as page animation
                        ease: "power2.inOut"
                    }, 0); // All animations start together
            }
        });
    }

    // Initialize menu state
    initMenuState();
    
    // Remove any existing event listeners to prevent duplicates
    burgerBtn.removeEventListener('click', openMenu);
    closeMenuBtn?.removeEventListener('click', closeMenu);
    
    // Add event listeners
    burgerBtn.addEventListener('click', openMenu);
    
    // Click outside (on .page_wrap) closes menu if open
    pageWrap.addEventListener('click', function() {
        if (menuOverlay.classList.contains('open')) closeMenu();
    });

    // Prevent closing when clicking inside the menu
    menuOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Prevent default behavior on close button to avoid URL hash
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 Close button clicked, preventing default behavior');
            closeMenu();
        });
    }


    
    console.log('✅ Menu system initialized successfully');
}

})();