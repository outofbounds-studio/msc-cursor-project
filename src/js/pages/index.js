// Page-specific code handlers
const pages = {
    // Home page functionality
    home: {
        init: () => {
            console.log('Home page initialized');
            // Add home page specific code here
        }
    },
    
    // About page functionality
    about: {
        init: () => {
            console.log('About page initialized');
            // Add about page specific code here
        }
    },
    
    // Work/Portfolio page functionality
    work: {
        init: () => {
            console.log('Work page initialized');
            // Add work page specific code here
        }
    },
    
    // Contact page functionality
    contact: {
        init: () => {
            console.log('Contact page initialized');
            // Add contact page specific code here
        }
    }
};

// Helper function to get current page name from Webflow
const getCurrentPage = () => {
    // Get page name from body class (Webflow adds these automatically)
    const bodyClasses = document.body.className.split(' ');
    const pageClass = bodyClasses.find(className => className.startsWith('page-'));
    return pageClass ? pageClass.replace('page-', '') : 'home';
};

// Initialize the current page
const initCurrentPage = () => {
    const currentPage = getCurrentPage();
    if (pages[currentPage] && typeof pages[currentPage].init === 'function') {
        pages[currentPage].init();
    } else {
        console.log('No specific initialization for page:', currentPage);
    }
};

export { initCurrentPage, pages }; 