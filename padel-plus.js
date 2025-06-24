document.addEventListener('DOMContentLoaded', function() {
  // ... (plugin checks, etc.)

  // Inject CSS to ensure proper initial states
  function injectFlipStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Override any 100vw styles and ensure proper container behavior */
      .logo-wrapper[data-flip-container="logo"] {
        width: 10em !important;
        max-width: 10em !important;
        min-width: 8em !important;
        transition: none !important;
        padding-right: 1em !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
      
      .hero-logo-wrapper[data-flip-container="logo"] {
        width: 100% !important;
        max-width: 100% !important;
        min-width: auto !important;
        transition: none !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
        padding: 0 0.8em !important;
        box-sizing: border-box !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 10 !important;
        overflow: visible !important;
      }
      
      [data-flip-id="logo"] {
        width: 100% !important;
        height: auto !important;
        transition: none !important;
        display: block !important;
      }
      
      /* Override any existing 100vw styles */
      .logo-wrapper {
        width: 10em !important;
        max-width: 10em !important;
        min-width: 8em !important;
      }
      
      .hero-logo-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        min-width: auto !important;
      }
    `;
    document.head.appendChild(style);
    console.log('[Flip Debug] Injected flip styles with 100% overrides');
  }

  // Initialize container widths
  function initializeContainerWidths() {
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    const heroContainer = document.querySelector('.hero-logo-wrapper[data-flip-container="logo"]');
    
    if (navbarContainer) {
      gsap.set(navbarContainer, {
        width: "10em",
        maxWidth: "10em",
        minWidth: "8em",
        paddingRight: "1em",
        boxSizing: "border-box"
      });
      console.log('[Flip Debug] Initialized navbar container to 10em with padding');
    }
    
    if (heroContainer) {
      gsap.set(heroContainer, {
        width: "100%",
        maxWidth: "100%",
        minWidth: "auto",
        padding: "0 0.8em",
        boxSizing: "border-box"
      });
      console.log('[Flip Debug] Initialized hero container to 100% with padding');
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

  // Remove logo FLIP logic and replace with simple width/opacity animation
  // Set initial state
  gsap.set('.logo-contain', { width: '100%' });
  gsap.set(['.nav-menu', '.contact-btn-wrap'], { opacity: 0, y: -20, pointerEvents: 'none' });

  // ScrollTrigger for logo/nav animation
  ScrollTrigger.create({
    trigger: '.hero', // or your hero section selector
    start: 'bottom top', // when hero leaves viewport
    onEnter: () => {
      gsap.to('.logo-contain', { width: '10em', duration: 0.7, ease: 'power2.inOut' });
      gsap.to(['.nav-menu', '.contact-btn-wrap'], { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.4, delay: 0.2 });
      document.body.classList.add('nav-active');
    },
    onLeaveBack: () => {
      gsap.to('.logo-contain', { width: '100%', duration: 0.7, ease: 'power2.inOut' });
      gsap.to(['.nav-menu', '.contact-btn-wrap'], { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.4 });
      document.body.classList.remove('nav-active');
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
        console.log(`[Flip Debug] [${context}] .logo-wrapper padding-right:`, getComputedStyle(navbarContainer).paddingRight);
      }
      if (heroContainer) {
        console.log(`[Flip Debug] [${context}] .hero-logo-wrapper width:`, getComputedStyle(heroContainer).width);
        console.log(`[Flip Debug] [${context}] .hero-logo-wrapper padding-right:`, getComputedStyle(heroContainer).paddingRight);
      }
    } else {
      console.warn(`[Flip Debug] [${context}] Logo not found`);
    }
  }

  function moveLogoToNavbar() {
    const logo = document.querySelector('[data-flip-id="logo"]');
    const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
    const heroContainer = document.querySelector('.hero-logo-wrapper[data-flip-container="logo"]');
    
    if (!logo || !navbarContainer || !heroContainer) {
      console.warn('[Flip Debug] moveLogoToNavbar: logo, navbarContainer, or heroContainer not found');
      return;
    }
    
    logLogoState('moveLogoToNavbar (before)');
    
    // Pre-set both containers to their final states BEFORE FLIP
    gsap.set(heroContainer, {
      width: "100%",
      maxWidth: "100%",
      minWidth: "auto",
      padding: "0 0.8em",
      boxSizing: "border-box"
    });
    
    gsap.set(navbarContainer, {
      width: "10em",
      maxWidth: "10em",
      minWidth: "8em",
      paddingRight: "1em",
      boxSizing: "border-box"
    });
    
    console.log('[Flip Debug] Containers set to final states before FLIP');
    logLogoState('moveLogoToNavbar (after container set)');
    
    // Get the FLIP state before moving
    const state = Flip.getState(logo, { props: "width" });
    
    // Move logo to navbar container
    navbarContainer.appendChild(logo);
    
    // Only animate the logo with FLIP - no container animations
    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onStart: () => {
        console.log('[Flip Debug] Flip.from (logo to navbar) started');
        logLogoState('Flip.from start (to navbar)');
      },
      onComplete: () => {
        console.log('[Flip Debug] Flip.from (logo to navbar) complete');
        logLogoState('Flip.from complete (to navbar)');
      }
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
    
    // Pre-set both containers to their final states BEFORE FLIP
    gsap.set(navbarContainer, {
      width: "10em",
      maxWidth: "10em",
      minWidth: "8em",
      paddingRight: "1em",
      boxSizing: "border-box"
    });
    
    gsap.set(heroContainer, {
      width: "100%",
      maxWidth: "100%",
      minWidth: "auto",
      padding: "0 0.8em",
      boxSizing: "border-box"
    });
    
    console.log('[Flip Debug] Containers set to final states before FLIP');
    logLogoState('moveLogoToHero (after container set)');
    
    // Get the FLIP state before moving
    const state = Flip.getState(logo, { props: "width" });
    
    // Move logo to hero container
    heroContainer.appendChild(logo);
    
    // Only animate the logo with FLIP - no container animations
    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onStart: () => {
        console.log('[Flip Debug] Flip.from (logo to hero) started');
        logLogoState('Flip.from start (to hero)');
      },
      onComplete: () => {
        console.log('[Flip Debug] Flip.from (logo to hero) complete');
        logLogoState('Flip.from complete (to hero)');
      }
    });
  }
}); 