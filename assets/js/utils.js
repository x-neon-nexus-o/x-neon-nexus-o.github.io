/**
 * Utility Functions
 */

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Export for global use if needed, though in this simple setup window.isInViewport is fine
window.isInViewport = isInViewport;
