// Ensure DOM is loaded before running scripts
document.addEventListener("DOMContentLoaded", function() {
  
  
    // Declare the themeCheckActive flag here
    let themeCheckActive = false; 

    function startThemeCheck() {
        if (!themeCheckActive) { // Use the flag to prevent multiple listeners 
            document.addEventListener("scroll", checkThemeSection);
            themeCheckActive = true; // Set flag to indicate listeners are active
            console.log("Theme check started; listeners reattached.");
        }
    }

    function stopThemeCheck() {
        document.removeEventListener("scroll", checkThemeSection);
        themeCheckActive = false; // Reset flag
        console.log("Theme check stopped; listeners removed.");
    }
  
// Define animation defaults and create a custom ease function
CustomEase.create("msc-ease", "0.625, 0.05, 0, 1");

let lenis;
let staggerDefault = 0.075;
let durationDefault = 0.8;

// Set GSAP default settings
gsap.defaults({
  ease: "msc-ease", // Updated to use the new ease name
  duration: durationDefault,
});

// Initialize Lenis for smooth scrolling with updated lerp value
lenis = new Lenis({
  lerp: 0.1,
  smooth: true
});

function animateScroll(time) {
  lenis.raf(time);
  requestAnimationFrame(animateScroll);
}
requestAnimationFrame(animateScroll);
  
  
 
// Function to initialize animations on the homepage
function stylesScrub() {
  // Create global variables for items
  let cmsItems = $(".work_item");
  let sizeSmall = (1 / 3) * 100 + "%"; // Small size percentage
  let sizeLarge = (2 / 3) * 100 + "%"; // Large size percentage

  // Loop through items to set up animations
  cmsItems.filter(":nth-child(odd)").each(function (index) {
    let oddItem = $(this);
    let evenItem = $(this).next();
    let row = $("<div class='work_row'></div>");
    let flex = $("<div class='work_flex'></div>");

    // Create layout
    row.insertBefore(oddItem);
    flex.appendTo(row);
    oddItem.add(evenItem).appendTo(flex);

    // Determine initial progress based on index
    let initialProgress = 0;
    if (index % 2 !== 0) {
      initialProgress = 1;
    }

    // Set up GSAP media query for responsive animations
    gsap.matchMedia().add("(min-width: 992px)", () => {
      let progressObject = { value: initialProgress };

      // Create timeline for items
      let tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.fromTo(oddItem, { width: sizeLarge }, { width: sizeSmall });
      tl.fromTo(evenItem, { width: sizeSmall }, { width: sizeLarge }, "<");
      tl.from(oddItem.find(".work_image"), { scale: 1.2 }, "<");
      tl.to(evenItem.find(".work_image"), { scale: 1.2 }, "<");
      tl.progress(initialProgress);

      // Function to update timeline progress based on mouse movement
      function setProgress(progressValue) {
        gsap.to(progressObject, {
          value: progressValue,
          ease: "sine.out",
          duration: 0.4,
          onUpdate: () => tl.progress(progressObject.value)
        });
      }

      // Mouse events for interaction
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

// Function to create GSAP timeline for theme change
function changeThemeTimeline(theme) {
  	console.log('Changing theme to:', theme); // Log the theme being applied
    const tl = gsap.timeline();
    
    // Set the theme attribute to trigger CSS variables
    tl.set("body", { attr: { "element-theme": theme } });

    // Animate the background color transition with easing
    tl.to("body", { 
        backgroundColor: "var(--color--background)", // Transition to the appropriate color
        duration: 0.5,
        ease: "power2.out" // Ensure your desired easing is applied
    });

    return tl;
}  
  
  
// Function to initialize ScrollTriggers
function initScrollTriggers() {
    const navBar = document.querySelector('.nav_bar'); // Reference to the navbar to calculate offsets
    const navBarMidpoint = navBar ? navBar.offsetHeight / 2 : 0; // Calculate the midpoint

    // Create ScrollTrigger to change theme based on scrolling sections
    ScrollTrigger.create({
        trigger: '[data-theme-section]', // Change this to target the defined sections
        start: `top ${navBarMidpoint}px`, // Trigger when the top of section hits the midpoint
        toggleActions: "play none none reverse", // Control the animation based on scroll position
        onEnter: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section'); // Get active section's theme
            changeThemeTimeline(themeSectionActive); // Change to the current theme
        },
        onLeaveBack: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section');
            const oppositeTheme = themeSectionActive === 'dark' ? 'light' : 'dark'; // Switch to the opposite theme
            changeThemeTimeline(oppositeTheme); // Apply opposite theme on scroll back
        },
    });
}
  
  
// Init Check Theme Function
function initCheckTheme() {
    function checkThemeSection() {
        var themeSections = document.querySelectorAll("[data-theme-section]"); // Get all sections with the theme attribute
        var navBar = document.querySelector('.nav_bar'); // Reference to the navbar to calculate offsets
        var themeObserverOffset = navBar ? navBar.offsetHeight / 2 : 0; // Calculate the offset

        themeSections.forEach(function (themeSection) {
            var themeSectionTop = themeSection.getBoundingClientRect().top; // Get the top position of the section
            var themeSectionBottom = themeSection.getBoundingClientRect().bottom; // Get the bottom position of the section

            // Check if the current section is in view
            if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
                var themeSectionActive = $(themeSection).attr('data-theme-section'); // Get the active theme from attribute
                changeThemeTimeline(themeSectionActive); // Call your existing changeThemeTimeline function
            }
        });
    }

    // Initial theme check on page load
    checkThemeSection();

    // Clean up on page transition
    barba.hooks.beforeLeave(() => {
        stopThemeCheck(); // Remove the scroll event listener
        ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Optionally clean up ScrollTriggers
    });

    barba.hooks.after(() => {
        console.log("After transition hook triggered.");
        checkThemeSection(); // Re-check the theme immediately after the transition
        startThemeCheck(); // Reattach the scroll event listener for the new page
        console.log("Theme checked and listeners started post-transition.");
    });
}

// Function to initialize ScrollTriggers
function initScrollTriggers() {
    const navBar = document.querySelector('.nav_bar'); // Reference to the navbar to calculate offsets
    const navBarMidpoint = navBar ? navBar.offsetHeight / 2 : 0; // Calculate the midpoint

    // Create ScrollTrigger to change theme based on scrolling sections
    ScrollTrigger.create({
        trigger: '[data-theme-section]', // Change this to target the defined sections
        start: `top ${navBarMidpoint}px`, // Trigger when the top of section hits the midpoint
        toggleActions: "play none none reverse", // Control the animation based on scroll position
        onEnter: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section'); // Get active section's theme
            changeThemeTimeline(themeSectionActive); // Change to the current theme
        },
        onLeaveBack: (self) => {
            const themeSectionActive = self.trigger.getAttribute('data-theme-section');
            const oppositeTheme = themeSectionActive === 'dark' ? 'light' : 'dark'; // Switch to the opposite theme
            changeThemeTimeline(oppositeTheme); // Apply opposite theme on scroll back
        },
    });
}  


  
// BG Video Function  
function initVimeoBGVideo() {
  // Select all elements that have [data-vimeo-bg-init]
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-bg-init]');

  vimeoPlayers.forEach(function(vimeoElement, index) {
    
    // Add Vimeo URL ID to the iframe [src]
    // Looks like: https://player.vimeo.com/video/1019191082
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=1&loop=1&muted=1`;
    vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);

    // Assign an ID to each element
    const videoIndexID = 'vimeo-player-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);

    const iframeID = vimeoElement.id;
    const player = new Vimeo.Player(iframeID);

    player.setVolume(0);
    
    player.on('bufferend', function() {
      vimeoElement.setAttribute('data-vimeo-activated', 'true');
      vimeoElement.setAttribute('data-vimeo-loaded', 'true');
    });
    
    // Update Aspect Ratio if [data-vimeo-update-size="true"]
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

    // Function to adjust video sizing
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
    // Adjust video sizing initially
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
    // Adjust video sizing on resize
    window.addEventListener('resize', adjustVideoSizing);
  });
}

// Initialize Vimeo Background Video
document.addEventListener('DOMContentLoaded', function() {
  initVimeoBGVideo();
});  

// Initialize Slider
function initSliders() {
    $(".slider-main_component").each(function (index) {
        let loopMode = false;
        if ($(this).attr("loop-mode") === "true") {
            loopMode = true;
        }
        
        let sliderDuration = 450;
        if ($(this).attr("slider-duration") !== undefined) {
            sliderDuration = +$(this).attr("slider-duration");
        }

        // Initialize the Swiper
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
}
  
  
// Initialize Testimonial Slider
function initTestimonial() {
    $(".slider-testimonial_component").each(function (index) {
        let loopMode = false;
        if ($(this).attr("loop-mode") === "true") {
            loopMode = true;
        }
        
        let sliderDuration = 450;
        if ($(this).attr("slider-duration") !== undefined) {
            sliderDuration = +$(this).attr("slider-duration");
        }

        // Initialize the Swiper
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
            
            // Add the on: object here for slide change events
            on: {
                slideChange: function () {
                    // Remove active class from all slides
                    this.slides.forEach(slide => {
                        slide.classList.remove('is-active');
                    });
                    // Add active class to the current slide
                    this.slides[this.activeIndex].classList.add('is-active');
                },
            }
        });
    });
}
  

function initTabSystem() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
  
  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
    
    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
    
    let activeContent = null; // keep track of active item/link
    let activeVisual = null;
    let isAnimating = false;
    let progressBarTween = null; // to stop/start the progress bar

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
      if (!bar) return;
      
      // In this function, you can basically do anything you want, that should happen as a tab is active
      // Maybe you have a circle filling, some other element growing, you name it.
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "power1.inOut",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length;
            switchTab(nextIndex); // once bar is full, set next to active – this is important
          }
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;
      
      isAnimating = true;
      if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here
      
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
          if (autoplay) startProgressBar(index); // Start autoplay bar here
        },
      });
      
      // Wrap 'outgoing' in a check to prevent warnings on first run of the function
      // Of course, during first run (on page load), there's no 'outgoing' tab yet!
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
        .fromTo( incomingContent.querySelector('[data-tabs="item-details"]'),{ height: 0 },{ height: "auto" },0)
        .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    // on page load, set first to active
    // idea: you could wrap this in a scrollTrigger
    // so it will only start once a user reaches this section
    switchTab(0);
    
    // switch tabs on click
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // ignore click if current one is already active
        switchTab(i);
      })
    );
    
  });
}

document.addEventListener("DOMContentLoaded", ()=> {
  initTabSystem();
});  
  
  
function initCustomCursor() {
  let cursorItem = document.querySelector(".cursor");
  let cursorParagraph = cursorItem.querySelector("p");
  let targets = document.querySelectorAll("[data-cursor]");
  let xOffset = 12;
  let yOffset = 75;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = '';

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quick.to for a more performative tween on the cursor
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  // On mousemove, call the quickTo functions to the actual cursor position
  window.addEventListener("mousemove", (e) => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset if in the rightmost 19% of the window
    if (cursorX > windowWidth * 0.81) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute("data-cursor");
      if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
        newText = currentTarget.getAttribute("data-easteregg");
      }

      if (newText !== lastText) { // Only update if the text is different
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    }

    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
    xTo(cursorX);
    yTo(cursorY - scrollY); // Subtract scroll for viewport positioning
  });

  // Add a mouse enter listener for each link that has a data-cursor attribute
  targets.forEach(target => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target; // Set the current target

      // If element has data-easteregg attribute, load different text
      let newText = target.hasAttribute("data-easteregg")
        ? target.getAttribute("data-easteregg")
        : target.getAttribute("data-cursor");

      // Update only if the text changes
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    });
  });
}

// Function Work hover
function setupThumbnailHoverEffect(containerSelector, thumbnailSelector, hoverImageSelector) {
  const thumbnailContainer = document.querySelector(containerSelector);
  const thumbnail = document.querySelector(thumbnailSelector);
  const hoverImage = document.querySelector(hoverImageSelector);

  // Log the elements to ensure they are selected correctly
  console.log("Thumbnail Container:", thumbnailContainer);
  console.log("Thumbnail Image:", thumbnail);
  console.log("Hover Image:", hoverImage);

  if (thumbnailContainer && thumbnail && hoverImage) {
    console.log("Setting up hover effect listeners..."); // Log when listeners are set up

    thumbnailContainer.addEventListener('mouseenter', () => {
      console.log("Mouse entered thumbnail container."); // Log mouse enter event
      gsap.to(hoverImage, { duration: 1, display: 'block', opacity: 1, ease: "power2.out" });
      gsap.to(thumbnail, { duration: 1, opacity: 0, ease: "power2.out" });
    });

    thumbnailContainer.addEventListener('mouseleave', () => {
      console.log("Mouse left thumbnail container."); // Log mouse leave event
      gsap.to(hoverImage, { duration: 0.75, display: 'none', opacity: 0, ease: "power2.out" });
      gsap.to(thumbnail, { duration: 0.75, opacity: 1, ease: "power2.out" });
    });
  } else {
    console.error("Element(s) not found for selector(s)", containerSelector, thumbnailSelector, hoverImageSelector);
  }
}

// Function to load SplitText Plugin
    function loadSplitTextPlugin(url, callback) {
        let script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";
        script.onload = callback; // Call the provided callback when the script is loaded
        document.body.appendChild(script);
    }

    // Function to initialize SplitText animation
    function initSplitTextAnimation() {
        const splitTextPluginUrl = "https://slater.app/13164/35586.js"; // Update this URL if needed
        loadSplitTextPlugin(splitTextPluginUrl, function() {
            gsap.registerPlugin(SplitText, ScrollTrigger);
            
            // Check if the target elements exist
            const targetText = document.querySelector("h2.h-display"); // The entire header

            // Debugging: Log if the target is found or not
            if (targetText) {
                console.log("Target text elements found.");
            } else {
                console.error("Target text elements not found. Please check the selector.");
                return; // Exit if target is not found
            }

            // Split the text into characters within the target
            const split = new SplitText(targetText, { 
                type: "chars" 
            });

            // Create a timeline with ScrollTrigger
            const tl = gsap
                .timeline({
                    scrollTrigger: {
                        trigger: ".split-text-scroll-trigger", // Your section's class that triggers the animation
                        start: "top 15%", // Start when the top of the trigger reaches 15% down the viewport
                        end: "+=250%", // Duration of the scroll effect
                        pin: true, // Pins the section on screen
                        scrub: 1, // Allows for smooth scrolling
                        markers: true // Use for debugging (you can remove it later)
                    }
                })
                .set(split.chars, { color: "#bab9b9" }) // Start with a light gray color
                .to(split.chars, {
                    color: "#161413", // Animate to a darker gray
                    duration: 1, // Duration of the color change
                    stagger: 0.1 // Stagger effect for characters
                });
        });
    }
  
// Hook to run when leaving a page
barba.hooks.leave((data) => {
    lenis.destroy(); // Ensure Lenis is properly destroyed
});

// Hook to run when entering a new page
barba.hooks.enter((data) => {
    window.scrollTo(0, 0); // Scroll to top on new page load
    
  // Apply the appropriate theme for the current page
    if (data.next.namespace === 'home') {
        changeThemeTimeline('dark'); // Assumes the home page should be dark theme
    } else if (data.next.namespace === 'about') {
        changeThemeTimeline('light'); // Assumes the about page should be light theme
    } else if (data.next.namespace === 'work') {
        changeThemeTimeline('dark'); // Assumes the about page should be light theme
    } else if (data.next.namespace === 'styles') {
        changeThemeTimeline('dark'); // Assumes the styles page theme is dark
    }
});
  
// Initialize Barba.js for page transitions
barba.init({
    transitions: [
        {
            name: 'global-transition', // Transition name
            leave(data) {
                const tl = gsap.timeline({
                    onComplete: () => {
                        data.current.container.remove(); // Cleanup current container on leave
                    }
                });
                tl.to(data.current.container, { autoAlpha: 0, duration: 0.5 }); // Fade out current content
                return tl; // Return the timeline
            },
            enter(data) {
                const tl = gsap.timeline({
                    onComplete: () => {
                        lenis.start(); // Start Lenis scroll on new content
                    }
                });
                tl.from(data.next.container, { autoAlpha: 0, duration: 0.5 }); // Fade in new content
                return tl; // Return the timeline
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
            initScrollTriggers(); // Call this to initialize ScrollTriggers for the homepage
		    initSplitTextAnimation(); // Call the function to set up SplitText animation
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
            initScrollTriggers(); // Call this to initialize ScrollTriggers specific to the about page
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
            initScrollTriggers(); // Call this to initialize ScrollTriggers for the styles page
        },
        afterLeave(data) {
            console.log("Leaving styles page...");
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }
]
});

// Initialize everything when the script loads
document.addEventListener("DOMContentLoaded", function() {
    console.log("Initializing all functions...");
    
    // Initialize based on current page
    const currentPage = document.body.getAttribute('data-barba-namespace');
    console.log("Current page:", currentPage);

    // Common initializations
    initCustomCursor();
    initCheckTheme();
    
    // Page-specific initializations
    switch(currentPage) {
        case 'home':
            stylesScrub();
            initVimeoBGVideo();
            initSliders();
            initTestimonial();
            initTabSystem();
            initScrollTriggers();
            initSplitTextAnimation();
            break;
        case 'about':
            initScrollTriggers();
            break;
        case 'work':
            setupThumbnailHoverEffect('.work-item-wrap', '.work-thumb_img', '.work-hover_img');
            if(window.Jetboost) Jetboost.ReInit();
            initTestimonial();
            initSliders();
            break;
        case 'styles':
            stylesScrub();
            initScrollTriggers();
            break;
    }
    
    console.log("All functions initialized");
});

