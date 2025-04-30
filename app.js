"use strict";

// Ensure Webflow is loaded
window.Webflow ||= [];
window.Webflow.push(() => {
    // Add a visible indicator that our code is running
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.padding = '10px';
    indicator.style.background = '#000';
    indicator.style.color = '#fff';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '9999';
    indicator.textContent = 'Cursor-Webflow Connected!';
    document.body.appendChild(indicator);
    
    console.log('Cursor-Webflow connection established!');
    
    // Handle WebSocket connection gracefully
    if (module.hot) {
        module.hot.accept(() => {
            console.log('HMR Update accepted');
        });
    }

    // Wrap CSS operations in try-catch
    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Your custom functionality here
            console.log('DOM fully loaded');
        } catch (error) {
            console.warn('CSS operation failed:', error);
        }
    });
}); 