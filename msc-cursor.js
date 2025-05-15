// msc.js - Metal Staircase Co. Website Scripts
// Version: 1.0.0 updated 13/05/2025 23.34

(function() {
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
            'https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/CustomEase.min.js',
            'https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd.min.js',
            'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js'
        ];

        try {
            await Promise.all(dependencies.map(src => loadScript(src)));
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
        // 1. Wait for all dependencies
        const dependenciesLoaded = await loadDependencies();
        if (!dependenciesLoaded) {
            console.error('Failed to load dependencies');
            return;
        }

        // 2. Wait for Slater scripts (SplitText, etc)
        await loadSlaterScripts();

        // 3. Now all libraries are loaded, safe to use barba, SplitText, etc
        utils.initGSAPDefaults();
        utils.lenis.init();
        barba.init(barbaConfig);

        // ---- Barba.js Hooks (must be after barba.init) ----
        barba.hooks.leave((data) => {
            utils.lenis.destroy();
        });

        barba.hooks.enter((data) => {
            window.scrollTo(0, 0);
            // Apply appropriate theme for the current page
            if (data.next.namespace === 'home') {
                utils.theme.change('dark');
            } else if (data.next.namespace === 'about') {
                utils.theme.change('dark');
            } else if (data.next.namespace === 'work') {
                utils.theme.change('dark');
            } else if (data.next.namespace === 'styles') {
                utils.theme.change('dark');
            }
        });

        components.initCustomCursor();
        // ...rest of your initialization...
        console.log('Initialization complete');

        // Global Barba hook to run on every page transition
        barba.hooks.afterEnter(() => {
            initMaskTextScrollReveal();
        });

        console.log('GSAP:', typeof gsap !== 'undefined' ? 'Loaded' : 'Not loaded');
        console.log('SplitText:', typeof SplitText !== 'undefined' ? 'Loaded' : 'Not loaded');
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
    
        // Theme Manager
        theme: {
            current: 'dark',
            isChecking: false,
            
            startCheck() {
                if (!this.isChecking) {
                    document.addEventListener("scroll", this.checkThemeSection);
                    this.isChecking = true;
                    console.log("Theme check started");
                }
            },
            
            stopCheck() {
                document.removeEventListener("scroll", this.checkThemeSection);
                this.isChecking = false;
                console.log("Theme check stopped");
            },
            
            change(theme) {
                if (this.current === theme) return;
                this.current = theme;
                this.applyTheme(theme);
            },
            
            applyTheme(theme) {
                const tl = gsap.timeline();
                tl.set("body", { attr: { "element-theme": theme } })
                  .to("body", { 
                      backgroundColor: "var(--color--background)",
                      duration: 0.5,
                      ease: "power2.out"
                  });
            },
    
            checkThemeSection() {
                var themeSections = document.querySelectorAll("[data-theme-section]");
                var navBar = document.querySelector('.nav_bar');
                var themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0;
    
                themeSections.forEach(function (themeSection) {
                    var themeSectionTop = themeSection.getBoundingClientRect().top;
                    var themeSectionBottom = themeSection.getBoundingClientRect().bottom;
    
                    if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
                        var themeSectionActive = $(themeSection).attr('data-theme-section');
                        utils.theme.applyTheme(themeSectionActive);
                    }
                });
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
        }
    };
    
    // Animation Functions
    const animations = {
        stylesScrub() {
            try {
                let cmsItems = $(".work_item");
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
    
        changeThemeTimeline(theme) {
            try {
                console.log('Changing theme to:', theme);
                return utils.theme.applyTheme(theme);
            } catch (error) {
                utils.handleError('changeThemeTimeline', error);
            }
        },
    
        initScrollTriggers() {
            try {
                const navBar = document.querySelector('.nav_bar');
                const navBarMidpoint = navBar ? navBar.offsetHeight / 2 : 0;
    
                ScrollTrigger.create({
                    trigger: '[data-theme-section]',
                    start: `top ${navBarMidpoint}px`,
                    toggleActions: "play none none reverse",
                    onEnter: (self) => {
                        const theme = self.trigger.getAttribute('data-theme-section');
                        utils.theme.change(theme);
                    },
                    onLeaveBack: (self) => {
                        const theme = self.trigger.getAttribute('data-theme-section');
                        const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
                        utils.theme.change(oppositeTheme);
                    }
                });
            } catch (error) {
                utils.handleError('initScrollTriggers', error);
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
                $(".slider-main_component").each(function (index) {
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
                $(".slider-testimonial_component").each(function (index) {
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
        }
    };
    
    // Page-Specific Logic
    const pages = {
        home: {
            beforeEnter() {
                console.log("Entering home page...");
                animations.stylesScrub();
                utils.theme.startCheck();
                components.initVimeoBGVideo();
                components.initSliders();
                components.initTestimonial();
                components.initTabSystem();
                components.initCustomCursor();
                animations.initScrollTriggers();
                animations.initSplitTextAnimation();
            },
            afterLeave() {
                console.log("Leaving home page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
        },
        about: {
            beforeEnter() {
                console.log("Entering about page...");
                utils.theme.startCheck();
                components.initCustomCursor();
                animations.initScrollTriggers();
                components.initTabSystem();
            },
            afterEnter() {
                components.initAccordionCSS();
                components.initModalBasic();
                initMaskTextScrollReveal();
                initNumberTickerAnimation();
            },
            afterLeave() {
                console.log("Leaving about page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
        },
        work: {
            beforeEnter() {
                console.log("Entering work page...");
                utils.theme.startCheck();
                components.initCustomCursor();
                //components.setupThumbnailHoverEffect('.work-item-wrap', '.work-thumb_img', '.work-hover_img');
                if (typeof Jetboost !== 'undefined') Jetboost.ReInit();
                components.initTestimonial();
                components.initSliders();
                
                if (typeof Webflow !== 'undefined') {
                    Webflow.destroy();
                    Webflow.ready();
                    Webflow.require('tabs').redraw();
                }
            },
            afterLeave() {
                console.log("Leaving work page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
        },
        styles: {
            beforeEnter() {
                console.log("Entering styles page...");
                animations.stylesScrub();
                components.initCustomCursor();
                animations.initScrollTriggers();
            },
            afterLeave() {
                console.log("Leaving styles page...");
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
        views: Object.entries(pages).map(([namespace, handlers]) => ({
            namespace,
            ...handlers
        }))
    };

    // SplitText/ScrollTrigger heading animation
    function initMaskTextScrollReveal() {
        console.log('initMaskTextScrollReveal running');
        document.querySelectorAll('[data-split="heading"]').forEach(heading => {
            // Revert previous split if exists
            if (heading._splitText) {
                heading._splitText.revert();
            }
            // Reset CSS visibility to prevent FOUC
            gsap.set(heading, { autoAlpha: 1 });
            // Find the split type, the default is 'lines'
            const type = heading.dataset.splitReveal || 'lines';
            const typesToSplit =
                type === 'lines' ? ['lines'] :
                type === 'words' ? ['lines','words'] :
                ['lines','words','chars'];
            // Split the text and store the instance for later revert
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
            gsap.from(targets, {
                y: 100,
                opacity: 0,
                duration: config.duration,
                stagger: config.stagger,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    once: true
                }
            });
        }
    }

    // === GSAP Number Ticker Animation with ScrollTrigger ===
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
                    }
                });
            }
        });
    }

    function initNumberTickerAnimation() {
        document.querySelectorAll('[data-animate-number]').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 80%',
                once: true,
                onEnter: () => animateNumberTicker(el)
            });
        });
    }
})();