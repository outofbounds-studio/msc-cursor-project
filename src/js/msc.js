// msc.js - Metal Staircase Co. Website Scripts
// Version: 1.0.0

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

    // Load all required dependencies
    async function loadDependencies() {
        const dependencies = [
            'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js',
            'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js',
            'https://player.vimeo.com/api/player.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
            'https://cdn.jsdelivr.net/gh/flowtricks/scripts@v1.0.4/variables-color-scroll.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/CustomEase.min.js',
            'https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd.min.js',
            'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js'
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

    // Load Slater scripts based on environment
    function loadSlaterScripts() {
        const isWebflow = window.location.host.includes("webflow.io");
        const baseUrl = isWebflow ? "https://slater.app/13164" : "https://assets.slater.app/slater/13164";
        
        // Load SplitText Plugin
        loadScript(`${baseUrl}/35586.js${isWebflow ? '' : '?v=1.0'}`)
            .then(() => console.log('Slater SplitText Plugin loaded'))
            .catch(error => console.error('Error loading SplitText Plugin:', error));

        // Load Metal Staircase Co script
        loadScript(`${baseUrl}.js${isWebflow ? '' : '?v=1.0'}`)
            .then(() => console.log('Metal Staircase Co script loaded'))
            .catch(error => console.error('Error loading Metal Staircase Co script:', error));
    }

    // Initialize the application
    async function init() {
        // Wait for dependencies to load
        const dependenciesLoaded = await loadDependencies();
        if (!dependenciesLoaded) {
            console.error('Failed to load dependencies');
            return;
        }

        // Load Slater scripts
        loadSlaterScripts();

        // Initialize core utilities
        utils.initGSAPDefaults();
        utils.lenis.init();
        
        // Initialize Barba.js
        barba.init(barbaConfig);
        
        // Initialize components that should run on every page
        components.initCustomCursor();
        
        console.log('Initialization complete');
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // [Rest of your code goes here - all the utils, components, animations, pages, and barbaConfig objects]
    // ... [Previous code structure remains the same] ...

})(); 