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

    // Helper: smoothly change volume
    function fadeVolume(video, target, durationMs, onDone) {
        try {
            var start = video.volume;
            var startTime = performance.now();
            var clampedTarget = Math.max(0, Math.min(1, target));
            function step(ts) {
                var t = Math.min(1, (ts - startTime) / durationMs);
                var v = start + (clampedTarget - start) * t;
                video.volume = v;
                if (t < 1) requestAnimationFrame(step);
                else if (typeof onDone === 'function') onDone();
            }
            requestAnimationFrame(step);
        } catch (_) { if (typeof onDone === 'function') onDone(); }
    }

    // Play/pause videos based on visibility; manage audio for HireMe section
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var v = entry.target;
                var inHireMe = v.closest('#HireMe') !== null;
                if (entry.isIntersecting) {
                    // Section visible
                    if (inHireMe) {
                        // If user gesture happened, unmute and play with audio
                        if (window.__audioGestureGranted__) {
                            v.muted = false;
                            // Fade in audio for smoother experience
                            if (v.volume < 0.95) fadeVolume(v, 1, 600);
                        }
                    }
                    try { if (v.paused) v.play(); } catch (_) { }
                } else {
                    // Section hidden: pause and mute to avoid audio leakage
                    if (inHireMe && !v.muted && v.volume > 0) {
                        // Fade out, then pause and mute
                        fadeVolume(v, 0, 500, function () {
                            try { if (!v.paused) v.pause(); } catch (_) { }
                            v.muted = true;
                            v.volume = 0;
                        });
                    } else {
                        try { if (!v.paused) v.pause(); } catch (_) { }
                        if (inHireMe) v.muted = true;
                    }
                }
            });
        }, { threshold: 0.6 });
        videos.forEach(function (v) { io.observe(v); });
    }

    // One-time user gesture to allow audio: click or keypress
    var audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        window.__audioGestureGranted__ = true;
        var bannerVideo = document.querySelector('#HireMe .banner-video');
        if (bannerVideo) {
            bannerVideo.muted = false; // enable audio after gesture
            bannerVideo.dataset.userInteracted = 'true';
            try { bannerVideo.play(); } catch (_) { }
        }
        var headerVideo = document.querySelector('header .header-video');
        if (headerVideo) {
            // Keep header muted by default; do not change
        }
        // Remove listeners after unlocking to avoid overhead
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    }
    window.addEventListener('click', unlockAudio, { once: false });
    window.addEventListener('keydown', unlockAudio, { once: false });

    // If user clicks the "HIRE ME" button/link, immediately unmute that section's video
    var hireLinks = document.querySelectorAll('a[href="#HireMe"]');
    hireLinks.forEach(function (a) {
        a.addEventListener('click', function () {
            window.__audioGestureGranted__ = true;
            var bannerVideo = document.querySelector('#HireMe .banner-video');
            if (bannerVideo) {
                bannerVideo.dataset.userInteracted = 'true';
                bannerVideo.muted = false;
                try { bannerVideo.play(); } catch (_) { }
            }
        });
    });

    // Error handling: hide broken videos
    videos.forEach(function (video) {
        video.addEventListener('error', function () {
            console.error('Video error:', video.currentSrc || video.src);
            if (video.parentElement) {
                video.parentElement.style.display = 'none';
            }
        });
    });
}
