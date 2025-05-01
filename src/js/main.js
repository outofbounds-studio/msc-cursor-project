// Register GSAP plugins and create custom ease
document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");

    // Global variables
    let themeCheckActive = false;
    let staggerDefault = 0.075;
    let durationDefault = 0.8;

    // Set GSAP defaults
    gsap.defaults({
        ease: "msc-ease",
        duration: durationDefault,
    });

    // Initialize Lenis
    let lenis = new Lenis({
        lerp: 0.1,
        smooth: true
    });

    function animateScroll(time) {
        lenis.raf(time);
        requestAnimationFrame(animateScroll);
    }
    requestAnimationFrame(animateScroll);

    // Theme Check Functions
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

    // Theme Change Timeline
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

    // Styles Scrub Function
    function stylesScrub() {
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
    }

    // Initialize ScrollTriggers
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
            },
        });
    }

    // Initialize Theme Check
    function initCheckTheme() {
        function checkThemeSection() {
            var themeSections = document.querySelectorAll("[data-theme-section]");
            var navBar = document.querySelector('.nav_bar');
            var themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0;

            themeSections.forEach(function (themeSection) {
                var themeSectionTop = themeSection.getBoundingClientRect().top;
                var themeSectionBottom = themeSection.getBoundingClientRect().bottom;

                if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
                    var themeSectionActive = $(themeSection).attr('data-theme-section');
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

    // Initialize Vimeo Background Video
    function initVimeoBGVideo() {
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
    }

    // Initialize Sliders
    function initSliders() {
        $(".slider-main_component").each(function (index) {
            let loopMode = $(this).attr("loop-mode") === "true";
            let sliderDuration = $(this).attr("slider-duration") !== undefined ? 
                +$(this).attr("slider-duration") : 450;

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
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
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

    // Initialize Testimonial Slider
    function initTestimonial() {
        $(".slider-testimonial_component").each(function (index) {
            let loopMode = $(this).attr("loop-mode") === "true";
            let sliderDuration = $(this).attr("slider-duration") !== undefined ? 
                +$(this).attr("slider-duration") : 450;

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
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                breakpoints: {
                    480: { slidesPerView: 1, spaceBetween: "4%" },
                    768: { slidesPerView: 2, spaceBetween: "4%" },
                    992: { slidesPerView: 4, spaceBetween: "1%" }
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
                    },
                }
            });
        });
    }

    // Initialize Tab System
    function initTabSystem() {
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
                    },
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
                
                outgoingContent?.classList.remove("active");
                outgoingVisual?.classList.remove("active");
                incomingContent.classList.add("active");
                incomingVisual.classList.add("active");
                
                const tl = gsap.timeline({
                    defaults: { duration: 0.65, ease: "power3" },
                    onComplete: () => {
                        activeContent = incomingContent;
                        activeVisual = incomingVisual;
                        isAnimating = false;
                        if (autoplay) startProgressBar(index);
                    },
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
                tl.fromTo(incomingVisual, 
                   { autoAlpha: 0, xPercent: 3 }, 
                   { autoAlpha: 1, xPercent: 0 }, 
                   0.3)
                  .fromTo(
                    incomingContent.querySelector('[data-tabs="item-details"]'),
                    { height: 0 },
                    { height: "auto" },
                    0
                  )
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
    }

    // Initialize Custom Cursor
    function initCustomCursor() {
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
    }

    // Initialize SplitText Animation
    function initSplitTextAnimation() {
        const splitTextPluginUrl = "https://slater.app/13164/35586.js";
        loadSplitTextPlugin(splitTextPluginUrl, function() {
            gsap.registerPlugin(SplitText, ScrollTrigger);
            
            const targetText = document.querySelector("h2.h-display");

            if (targetText) {
                console.log("Target text elements found.");
            } else {
                console.error("Target text elements not found. Please check the selector.");
                return;
            }

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
                        scrub: 1,
                        markers: true
                    }
                })
                .set(split.chars, { color: "#bab9b9" })
                .to(split.chars, {
                    color: "#161413",
                    duration: 1,
                    stagger: 0.1
                });
        });
    }

    // Initialize Barba.js
    barba.init({
        transitions: [
            {
                name: 'global-transition',
                leave(data) {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            data.current.container.remove();
                        }
                    });
                    tl.to(data.current.container, { autoAlpha: 0, duration: 0.5 });
                    return tl;
                },
                enter(data) {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            lenis.start();
                        }
                    });
                    tl.from(data.next.container, { autoAlpha: 0, duration: 0.5 });
                    return tl;
                }
            }
        ],
        views: [
            {
                namespace: 'home',
                beforeEnter(data) {
                    console.log("Entering home page...");
                    console.log("Running homepage-specific scripts.");
                    stylesScrub();
                    initCheckTheme();
                    initVimeoBGVideo();
                    initSliders();
                    initTestimonial();
                    initTabSystem();
                    initCustomCursor();
                    initScrollTriggers();
                    initSplitTextAnimation();
                },
                afterLeave(data) {
                    console.log("Leaving home page...");
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                }
            },
            {
                namespace: 'about',
                beforeEnter(data) {
                    console.log("Entering about page...");
                    console.log("Running about-specific scripts.");
                    initCheckTheme();
                    initCustomCursor();
                    initScrollTriggers();
                },
                afterLeave(data) {
                    console.log("Leaving about page...");
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                }
            },
            {
                namespace: 'work',
                beforeEnter(data) {
                    console.log("Entering work page...");
                    console.log("Running work-specific scripts.");
                    initCheckTheme();
                    initCustomCursor();
                    setupThumbnailHoverEffect('.work-item-wrap', '.work-thumb_img', '.work-hover_img');
                    Jetboost.ReInit();
                    initTestimonial();
                    initSliders();
                },
                afterLeave(data) {
                    console.log("Leaving work page...");
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                }
            },
            {
                namespace: 'styles',
                beforeEnter(data) {
                    console.log("Entering styles page...");
                    console.log("Running styles-specific scripts.");
                    stylesScrub();
                    initCustomCursor();
                    initScrollTriggers();
                },
                afterLeave(data) {
                    console.log("Leaving styles page...");
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                }
            }
        ]
    });

    // Initialize everything
    initCheckTheme();
    initVimeoBGVideo();
    initSliders();
    initTestimonial();
    initTabSystem();
    initCustomCursor();
    initScrollTriggers();
    initSplitTextAnimation();
});