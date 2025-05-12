function initAccordionCSS() {
    console.log('initAccordionCSS function called');
    
    const accordions = document.querySelectorAll('[data-accordion-css-init]');
    console.log('Found accordions:', accordions.length);
    
    accordions.forEach((accordion) => {
        console.log('Setting up accordion:', accordion);
        const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';
        console.log('Close siblings setting:', closeSiblings);

        accordion.addEventListener('click', (event) => {
            console.log('Accordion clicked');
            const toggle = event.target.closest('[data-accordion-toggle]');
            if (!toggle) {
                console.log('No toggle element found');
                return;
            }
            console.log('Toggle element found:', toggle);

            const singleAccordion = toggle.closest('[data-accordion-status]');
            if (!singleAccordion) {
                console.log('No accordion container found');
                return;
            }
            console.log('Accordion container found:', singleAccordion);

            const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
            console.log('Current active status:', isActive);
            
            singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
            console.log('New status set to:', isActive ? 'not-active' : 'active');
            
            // When [data-accordion-close-siblings="true"]
            if (closeSiblings && !isActive) {
                const activeSiblings = accordion.querySelectorAll('[data-accordion-status="active"]');
                console.log('Closing siblings, found:', activeSiblings.length);
                activeSiblings.forEach((sibling) => {
                    if (sibling !== singleAccordion) {
                        sibling.setAttribute('data-accordion-status', 'not-active');
                        console.log('Closed sibling:', sibling);
                    }
                });
            }
        });
    });
}

// Initialize Accordion CSS
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing accordion');
    initAccordionCSS();
});

// Export the function for use in Barba namespace
export { initAccordionCSS }; 