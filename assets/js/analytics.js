/**
 * Analytics & Tracking Module
 */

const Analytics = (function () {
    // Configuration
    const config = {
        enableTracking: true,
        trackClicks: true,
        trackScrollDepth: true,
        trackTimeOnPage: true,
        trackSearchQueries: true
    };

    /**
     * Main tracking function - sends events to Google Analytics
     */
    function trackEvent(category, action, label) {
        if (!config.enableTracking || typeof gtag === 'undefined') return;

        try {
            const eventData = {
                event_category: category,
                event_label: typeof label === 'string' ? label : JSON.stringify(label)
            };

            if (typeof label === 'object') {
                Object.assign(eventData, label);
            }

            gtag('event', action, eventData);

            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log(`[Analytics] Category: ${category}, Action: ${action}`, label);
            }
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    function init() {
        if (!config.enableTracking) return;

        initializeEventTracking();
        initializeScrollTracking();
        initializeTimeTracking();
    }

    function initializeEventTracking() {
        // Track social media clicks
        document.querySelectorAll('.social-icon').forEach(link => {
            let platform = 'unknown';
            if (link.classList.contains('github')) platform = 'github';
            else if (link.classList.contains('linkedin')) platform = 'linkedin';
            else if (link.classList.contains('instagram')) platform = 'instagram';

            link.addEventListener('click', () => {
                trackEvent('engagement', 'social_media_click', {
                    platform: platform,
                    url: link.getAttribute('href')
                });
            });
        });

        // Track navigation clicks
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                trackEvent('navigation', 'menu_click', {
                    section: link.textContent.trim(),
                    destination: link.getAttribute('href')
                });
            });
        });

        // Track "HIRE ME" button
        document.querySelectorAll('.futuristic-nav-btn, .futuristic-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                trackEvent('conversion', 'hire_me_click', {
                    button_text: btn.textContent.trim()
                });
            });
        });
    }

    function initializeScrollTracking() {
        if (!config.trackScrollDepth) return;
        const maxScroll = {};

        window.addEventListener('scroll', () => {
            const scrollPercentage = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            [25, 50, 75, 100].forEach(milestone => {
                if (scrollPercentage >= milestone && !maxScroll[milestone]) {
                    maxScroll[milestone] = true;
                    trackEvent('engagement', 'scroll_depth', { percentage: milestone });
                }
            });
        }, { passive: true });
    }

    function initializeTimeTracking() {
        if (!config.trackTimeOnPage) return;
        const startTime = Date.now();
        const intervals = [30, 60, 120, 300];
        const tracked = {};

        setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            intervals.forEach(interval => {
                if (timeSpent >= interval && !tracked[interval]) {
                    tracked[interval] = true;
                    trackEvent('engagement', 'time_on_page', { duration_seconds: interval });
                }
            });
        }, 5000);

        window.addEventListener('beforeunload', () => {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            trackEvent('engagement', 'page_exit', { duration_seconds: totalTime });
        });
    }

    return {
        init,
        trackEvent,
        config
    };
})();

document.addEventListener('DOMContentLoaded', Analytics.init);
