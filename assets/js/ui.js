/**
 * Main UI Logic
 * Handles Typewriter, Navigation, Scroll Spy, and Browser Compatibility
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initAboutAnimation();
    initBackToTop();
    initVideoEnhancements();
});

// Initialize Floating and Scroll Navs immediately (IIFE pattern from original code)
initFloatingNav();
initScrollUpNav();
initScrollSpy();
initBrowserCompatibility();


/**
 * Typewriter Effect
 */
function initTypewriter() {
    const typewriterText = document.querySelector('.typewriter-text');
    const text = 'Prathamesh Gawas';
    let index = 0;

    const designationEl = document.querySelector('.designation-typewriter');
    const designationText = 'Software Developer';
    let dIndex = 0;

    function type() {
        if (typewriterText && index < text.length) {
            typewriterText.textContent += text[index];
            index++;
            setTimeout(type, 100);
        } else if (typewriterText) {
            typewriterText.parentElement.classList.add('typing-complete');
            setTimeout(typeDesignation, 400);
        }
    }

    function typeDesignation() {
        if (!designationEl) return;
        if (dIndex < designationText.length) {
            designationEl.textContent += designationText[dIndex];
            dIndex++;
            setTimeout(typeDesignation, 90);
        }
    }

    type();
}

/**
 * About Section Animation
 */
function initAboutAnimation() {
    const aboutTitle = document.querySelector('.about-title');
    const aboutContent = document.querySelector('.about-content');

    if (!aboutTitle || !aboutContent) return;

    const animateAboutSection = () => {
        // Ensure isInViewport is available (from utils.js)
        if (typeof isInViewport === 'function' && isInViewport(aboutTitle) && aboutTitle.style.opacity === '0') {
            aboutTitle.style.opacity = '1';
            aboutTitle.style.transform = 'translateY(0)';

            aboutContent.style.opacity = '1';
            aboutContent.style.transform = 'translateY(0)';

            // Remove event listener after animation plays once
            window.removeEventListener('scroll', animateAboutSection);
        }
    };

    // Initial check in case the section is already in view
    animateAboutSection();

    // Add scroll event listener
    window.addEventListener('scroll', animateAboutSection);
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Floating Navigation (Right Side)
 */
function initFloatingNav() {
    const floatingNav = document.getElementById('floating-nav');
    const list = document.getElementById('floating-nav-list');
    const source = document.getElementById('navcol-5');

    if (source && list) {
        list.innerHTML = '';
        const links = source.querySelectorAll('ul.navbar-nav li a');
        links.forEach(function (a) {
            list.appendChild(a.cloneNode(true));
        });
        const hireBtn = source.querySelector('.btn');
        if (hireBtn) {
            list.appendChild(hireBtn.cloneNode(true));
        }
    }

    if (!floatingNav) return;

    let lastY = window.pageYOffset || 0;
    let ticking = false;
    let navigationInProgress = false;

    function lockNavVisible() {
        navigationInProgress = true;
        floatingNav.classList.add('visible');
    }

    function unlockNavVisible() {
        navigationInProgress = false;
    }

    function onScroll() {
        if (navigationInProgress) {
            ticking = false;
            return;
        }
        const y = window.pageYOffset || 0;
        const dirDown = y > lastY;
        const nearTop = y < 120;
        if (dirDown && y > 200) {
            floatingNav.classList.add('visible');
        } else if (!dirDown || nearTop) {
            floatingNav.classList.remove('visible');
        }
        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('click', function (e) {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        lockNavVisible();
        setTimeout(unlockNavVisible, 800);
    });

    window.addEventListener('hashchange', function () {
        lockNavVisible();
        lastY = window.pageYOffset || 0;
        setTimeout(unlockNavVisible, 500);
    });

    window.addEventListener('popstate', function () {
        lockNavVisible();
        lastY = window.pageYOffset || 0;
        setTimeout(unlockNavVisible, 500);
    });

    try {
        window.addEventListener('scrollend', function () {
            if (navigationInProgress) unlockNavVisible();
        });
    } catch (_) { }

    // Test param logic
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('test') === '1') {
            const ids = ['about', 'education', 'projects', 'skills', 'contact-us'];
            let i = 0;
            function step() {
                if (i >= ids.length) return;
                location.hash = ids[i++];
                setTimeout(step, 400);
            }
            step();
        }
    } catch (_) { }
}

/**
 * Scroll Up Navigation (Top)
 */
function initScrollUpNav() {
    const source = document.getElementById('navcol-5');
    const list = document.getElementById('scroll-nav-list');

    if (source && list) {
        list.innerHTML = '';
        const links = source.querySelectorAll('ul.navbar-nav li a');
        links.forEach(function (a) {
            list.appendChild(a.cloneNode(true));
        });
        const hireBtn = source.querySelector('.btn');
        if (hireBtn) {
            list.appendChild(hireBtn.cloneNode(true));
        }
    }

    const scrollNav = document.getElementById('scroll-up-nav');
    if (!scrollNav) return;

    let lastY = window.pageYOffset || 0;
    let ticking = false;
    let wantVisible = false;
    let appearTimer = null;

    function showNavDelayed() {
        if (appearTimer) return;
        appearTimer = setTimeout(function () {
            appearTimer = null;
            if (wantVisible) scrollNav.classList.add('visible');
        }, 250);
    }

    function hideNav() {
        if (appearTimer) { clearTimeout(appearTimer); appearTimer = null; }
        wantVisible = false;
        scrollNav.classList.remove('visible');
    }

    function onScrollTopNav() {
        const y = window.pageYOffset || 0;
        const directionUp = y < lastY;
        if (directionUp) {
            wantVisible = true;
            showNavDelayed();
        } else {
            hideNav();
        }
        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScrollTopNav);
            ticking = true;
        }
    }, { passive: true });

    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('scrolltest') === '1') {
            let step = 0;
            function run() {
                step++;
                if (step === 1) window.scrollTo({ top: 800, behavior: 'instant' });
                if (step === 2) window.scrollTo({ top: 600, behavior: 'instant' });
                if (step === 3) window.scrollTo({ top: 1000, behavior: 'instant' });
                if (step === 4) return;
                setTimeout(run, 400);
            }
            setTimeout(run, 300);
        }
    } catch (_) { }
}

/**
 * Scroll Spy (Active Link Highlighting)
 */
function initScrollSpy() {
    var sectionIds = ['about', 'experience', 'education', 'skills', 'HireMe', 'projects', 'contact-us'];
    var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function allNavLinks() {
        var links = [];
        var containers = [document.getElementById('navcol-5'), document.getElementById('floating-nav-list'), document.getElementById('scroll-nav-list')];
        for (var i = 0; i < containers.length; i++) {
            var c = containers[i]; if (!c) continue;
            var q = c.querySelectorAll('a[href^="#"]');
            for (var j = 0; j < q.length; j++) links.push(q[j]);
        }
        return links;
    }

    function setActive(id) {
        var links = allNavLinks();
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href');
            if (href === '#' + id) { links[i].classList.add('active'); }
            else { links[i].classList.remove('active'); }
        }
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (e) { return e.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
            if (visible.length) setActive(visible[0].target.id);
        }, { root: null, threshold: 0.6 });
        for (var k = 0; k < sections.length; k++) io.observe(sections[k]);
    } else {
        var lastId = '';
        function onScroll() {
            var center = (window.innerHeight || document.documentElement.clientHeight) / 2;
            for (var i = 0; i < sections.length; i++) {
                var r = sections[i].getBoundingClientRect();
                if (r.top <= center && r.bottom >= center) { if (lastId !== sections[i].id) { lastId = sections[i].id; setActive(lastId); } break; }
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
}

/**
 * Browser Compatibility Checks
 */
function initBrowserCompatibility() {
    // Polyfill for fetch API (for older browsers)
    if (!window.fetch) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3/dist/fetch.umd.js';
        document.head.appendChild(script);
    }

    // Check for IntersectionObserver support
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver not supported.');
    }

    // Log browser info for debugging
    var ua = navigator.userAgent;
    console.log('User Agent:', ua);

    // Add browser compatibility class to HTML element
    var isIE = ua.indexOf('Trident') > -1;
    var isEdge = ua.indexOf('Edg') > -1;
    var isChrome = ua.indexOf('Chrome') > -1;
    var isFirefox = ua.indexOf('Firefox') > -1;
    var isSafari = ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1;

    var html = document.documentElement;
    if (isIE) html.classList.add('is-ie');
    if (isEdge) html.classList.add('is-edge');
    if (isChrome) html.classList.add('is-chrome');
    if (isFirefox) html.classList.add('is-firefox');
    if (isSafari) html.classList.add('is-safari');
}

/**
 * Video Progressive Enhancement
 */
function initVideoEnhancements() {
    var videos = document.querySelectorAll('video');
    videos.forEach(function (video) {
        // Ensure video controls are accessible
        if (!video.hasAttribute('controls') && video.hasAttribute('autoplay')) {
            video.addEventListener('play', function (e) {
                // Pause on first play if user hasn't interacted
                if (!video.dataset.userInteracted) {
                    video.pause();
                }
            });

            video.addEventListener('click', function () {
                video.dataset.userInteracted = 'true';
                if (video.paused) video.play();
                else video.pause();
            });
        }

        // Add error handling
        video.addEventListener('error', function () {
            console.error('Video error:', video.src);
            // Hide video container on error
            if (video.parentElement) {
                video.parentElement.style.display = 'none';
            }
        });
    });
}
