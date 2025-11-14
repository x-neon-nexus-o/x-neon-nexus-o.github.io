/* Scroll-triggered animations using Intersection Observer */
(function() {
  var prefersReduced = false;
  try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

  var isMobile = false;
  try { isMobile = window.matchMedia('(max-width: 768px)').matches; } catch (_) {}

  var cfg = { threshold: isMobile ? 0.20 : 0.10, rootMargin: '0px 0px -100px 0px' };

  var selectors = {
    fadeUp: Array.prototype.slice.call(document.querySelectorAll('.project-card')),
    slideLeft: Array.prototype.slice.call(document.querySelectorAll('.section-title')),
    zoom: Array.prototype.slice.call(document.querySelectorAll('.banner, .about-container'))
  };

  function prepare(elements, cls, stagger) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      el.classList.add('anim');
      el.classList.add(cls);
      el.style.setProperty('--anim-delay', (i * stagger) + 'ms');
    }
  }

  prepare(selectors.fadeUp, 'fade-up', 100);
  prepare(selectors.slideLeft, 'slide-left', 60);
  prepare(selectors.zoom, 'zoom', 60);

  if (prefersReduced) {
    var allReduced = document.querySelectorAll('.anim');
    for (var j = 0; j < allReduced.length; j++) allReduced[j].classList.add('in-view');
    return;
  }

  var queue = [];
  var scheduled = false;
  function flush() {
    scheduled = false;
    for (var i = 0; i < queue.length; i++) {
      var el = queue[i];
      el.style.willChange = 'opacity, transform';
      el.classList.add('in-view');
      el.addEventListener('transitionend', function(e) { e.currentTarget.style.willChange = ''; }, { once: true });
    }
    queue.length = 0;
  }
  function schedule(el) {
    queue.push(el);
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(flush); }
  }

  function observeIO() {
    var io = new IntersectionObserver(function(entries, obs) {
      for (var k = 0; k < entries.length; k++) {
        var entry = entries[k];
        if (entry.isIntersecting) { schedule(entry.target); obs.unobserve(entry.target); }
      }
    }, { root: null, rootMargin: cfg.rootMargin, threshold: cfg.threshold });
    var anims = document.querySelectorAll('.anim');
    for (var m = 0; m < anims.length; m++) io.observe(anims[m]);
  }

  if ('IntersectionObserver' in window) { observeIO(); }
  else {
    // IE11 fallback: simple fade using scroll + rAF
    var els = Array.prototype.slice.call(document.querySelectorAll('.anim'));
    function check() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top < h - 100) { els[i].classList.add('in-view'); els.splice(i, 1); i--; }
      }
    }
    var ticking = false;
    function onScroll(){ if (!ticking) { ticking = true; window.requestAnimationFrame(function(){ ticking = false; check(); }); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
  }
})();
