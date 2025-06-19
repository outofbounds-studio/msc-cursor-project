function moveLogoToNavbar() {
  const logo = document.querySelector('[data-flip-id="logo"]');
  const navbarContainer = document.querySelector('.logo-wrapper[data-flip-container="logo"]');
  if (!logo || !navbarContainer) {
    console.warn('[Flip Debug] moveLogoToNavbar: logo or navbarContainer not found');
    return;
  }
  const state = Flip.getState(logo, { props: "width" }); // Track width as well
  navbarContainer.appendChild(logo);

  // Animate width from 100vw to 10em
  gsap.to(navbarContainer, { width: "10em", maxWidth: "10em", duration: 0.7, ease: "power2.inOut", onStart: () => console.log('[Flip Debug] gsap.to (navbar width to 10em) started'), onComplete: () => console.log('[Flip Debug] gsap.to (navbar width to 10em) complete') });

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
  const state = Flip.getState(logo, { props: "width" }); // Track width as well
  heroContainer.appendChild(logo);

  // Animate width from 10em back to 100vw
  gsap.to(navbarContainer, { width: "100vw", maxWidth: "100vw", duration: 0.7, ease: "power2.inOut", onStart: () => console.log('[Flip Debug] gsap.to (navbar width to 100vw) started'), onComplete: () => console.log('[Flip Debug] gsap.to (navbar width to 100vw) complete') });

  Flip.from(state, {
    duration: 0.7,
    ease: "power2.inOut",
    absolute: true,
    scale: true,
    onStart: () => console.log('[Flip Debug] Flip.from (logo to hero) started'),
    onComplete: () => console.log('[Flip Debug] Flip.from (logo to hero) complete')
  });
}

// LOGO FLIP
ScrollTrigger.create({
  trigger: ".hero", // The hero section
  start: "top top+=1", // triggers as soon as user scrolls 1px
  end: "+=1", // Just a tiny range to trigger once
  onEnter: () => {
    console.log('[Flip Debug] ScrollTrigger LOGO onEnter (moveLogoToNavbar)');
    moveLogoToNavbar();
  },
  onLeaveBack: () => {
    console.log('[Flip Debug] ScrollTrigger LOGO onLeaveBack (moveLogoToHero)');
    moveLogoToHero();
  }
}); 