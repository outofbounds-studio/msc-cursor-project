document.addEventListener('DOMContentLoaded', function() {
  // ... (plugin checks, etc.)

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

    gsap.to(navbarContainer, {
      width: "100vw",
      maxWidth: "100vw",
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        console.log('[Flip Debug] gsap.to (navbar width to 100vw) started');
        logLogoState('gsap.to start (to 100vw)');
      },
      onComplete: () => {
        console.log('[Flip Debug] gsap.to (navbar width to 100vw) complete');
        logLogoState('gsap.to complete (to 100vw)');
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