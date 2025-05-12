// Function to handle tab opacity changes
function initTabOpacity() {
    // Get all tab links
    const tabLinks = document.querySelectorAll('.Tab-Link');
    
    // Add click event listener to each tab link
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Reset opacity for all tab links
            tabLinks.forEach(tab => {
                tab.style.opacity = '0.3';
            });
            
            // Set active tab to full opacity
            link.style.opacity = '1';
        });
    });
    
    // Set initial state
    const activeTab = document.querySelector('.Tab-Link.w--current');
    if (activeTab) {
        activeTab.style.opacity = '1';
        tabLinks.forEach(tab => {
            if (tab !== activeTab) {
                tab.style.opacity = '0.3';
            }
        });
    }
}

// Initialize Tab Opacity
document.addEventListener('DOMContentLoaded', () => {
    initTabOpacity();
});

// Export the function for use in Barba namespace
export { initTabOpacity }; 