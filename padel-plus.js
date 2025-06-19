document.addEventListener('DOMContentLoaded', function() {
  // ... (plugin checks, etc.)

  // Inject CSS to ensure proper initial states
  function injectFlipStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .logo-wrapper[data-flip-container="logo"] {
        width: 10em !important;
        max-width: 10em !important;
        transition: none !important;
      }
      
      .hero-logo-wrapper[data-flip-container="logo"] {
        width: 100% !important;
        max-width: 100% !important;
        transition: none !important;
      }
      
      [data-flip-id="logo"] {
        width: 100% !important;
        height: auto !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    console.log('[Flip Debug] Injected flip styles');
  }

  // Initialize container widths
  function initializeContainerWidths() {
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    const heroContainer = document.querySelector('.hero-logo-wrapper[data-flip-container="logo"]');
    
    if (navbarContainer) {
      gsap.set(navbarContainer, {
        width: "10em",
        maxWidth: "10em"
      });
      console.log('[Flip Debug] Initialized navbar container to 10em');
    }
    
    if (heroContainer) {
      gsap.set(heroContainer, {
        width: "100%",
        maxWidth: "100%"
      });
      console.log('[Flip Debug] Initialized hero container to 100%');
    }
  }

  // Manual test function
  function addManualTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Logo Animation';
    testButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    
    let isInNavbar = false;
    testButton.addEventListener('click', () => {
      console.log('[Flip Debug] Manual test button clicked');
      if (isInNavbar) {
        moveLogoToHero();
        isInNavbar = false;
        testButton.textContent = 'Test Logo Animation (Move to Hero)';
      } else {
        moveLogoToNavbar();
        isInNavbar = true;
        testButton.textContent = 'Test Logo Animation (Move to Navbar)';
      }
    });
    
    document.body.appendChild(testButton);
    console.log('[Flip Debug] Added manual test button');
  }

  // Initialize on load
  injectFlipStyles();
  initializeContainerWidths();
  addManualTestButton();

  // LOGO FLIP
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top+=1",
    end: "+=1",
    onEnter: () => {
      console.log('[Flip Debug] ScrollTrigger LOGO onEnter (moveLogoToNavbar)');
      logLogoState('onEnter');
      moveLogoToNavbar();
    },
    onLeaveBack: () => {
      console.log('[Flip Debug] ScrollTrigger LOGO onLeaveBack (moveLogoToHero)');
      logLogoState('onLeaveBack');
      moveLogoToHero();
    },
    onUpdate: self => {
      console.log('[Flip Debug] ScrollTrigger LOGO onUpdate', {
        progress: self.progress,
        scroll: self.scroll(),
        start: self.start,
        end: self.end
      });
    }
  });

  function logLogoState(context) {
    const logo = document.querySelector('[data-flip-id="logo"]');
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    const heroContainer = document.querySelector('.hero-logo-wrapper[data-flip-container="logo"]');
    if (logo) {
      console.log(`[Flip Debug] [${context}] Logo parent:`, logo.parentElement);
      if (navbarContainer) {
        console.log(`[Flip Debug] [${context}] .logo-wrapper width:`, getComputedStyle(navbarContainer).width);
      }
      if (heroContainer) {
        console.log(`[Flip Debug] [${context}] .hero-logo-wrapper width:`, getComputedStyle(heroContainer).width);
      }
    } else {
      console.warn(`[Flip Debug] [${context}] Logo not found`);
    }
  }

  function moveLogoToNavbar() {
    const logo = document.querySelector('[data-flip-id="logo"]');
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    if (!logo || !navbarContainer) {
      console.warn('[Flip Debug] moveLogoToNavbar: logo or navbarContainer not found');
      return;
    }
    logLogoState('moveLogoToNavbar (before)');
    const state = Flip.getState(logo, { props: "width" });
    navbarContainer.appendChild(logo);

    gsap.to(navbarContainer, {
      width: "10em",
      maxWidth: "10em",
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        console.log('[Flip Debug] gsap.to (navbar width to 10em) started');
        logLogoState('gsap.to start (to 10em)');
      },
      onComplete: () => {
        console.log('[Flip Debug] gsap.to (navbar width to 10em) complete');
        logLogoState('gsap.to complete (to 10em)');
      }
    });

    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onStart: () => console.log('[Flip Debug] Flip.from (logo to navbar) started'),
      onComplete: () => console.log('[Flip Debug] Flip.from (logo to navbar) complete')
    });
  }

  function moveLogoToHero() {
    const logo = document.querySelector('[data-flip-id="logo"]');
    const heroContainer = document.querySelector('.hero-logo-wrapper[data-flip-container="logo"]');
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    if (!logo || !heroContainer || !navbarContainer) {
      console.warn('[Flip Debug] moveLogoToHero: logo, heroContainer, or navbarContainer not found');
      return;
    }
    logLogoState('moveLogoToHero (before)');
    const state = Flip.getState(logo, { props: "width" });
    heroContainer.appendChild(logo);

    // Reset navbar container to 10em width (in case it was changed)
    gsap.set(navbarContainer, {
      width: "10em",
      maxWidth: "10em"
    });

    // Animate hero container to full width
    gsap.to(heroContainer, {
      width: "100%",
      maxWidth: "100%",
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        console.log('[Flip Debug] gsap.to (hero width to 100%) started');
        logLogoState('gsap.to start (to 100%)');
      },
      onComplete: () => {
        console.log('[Flip Debug] gsap.to (hero width to 100%) complete');
        logLogoState('gsap.to complete (to 100%)');
      }
    });

    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onStart: () => console.log('[Flip Debug] Flip.from (logo to hero) started'),
      onComplete: () => console.log('[Flip Debug] Flip.from (logo to hero) complete')
    });
  }
}); 