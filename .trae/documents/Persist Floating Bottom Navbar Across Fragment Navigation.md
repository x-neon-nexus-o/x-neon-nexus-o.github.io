## Context

* Floating bottom navbar exists (`#floating-nav`) and clones main navbar links.

* Visibility toggles on scroll direction and thresholds; CSS uses `position: fixed`, blur/glass styling, and high `z-index`.

## Fragment Triggers to Track

* Anchor clicks: `a[href^="#"]` throughout the document.

* `hashchange` for in-page fragment navigation.

* `popstate` for back/forward navigation.

* `scrollend` if available; fallback to timeouts.

## Event Handling

* Add global listeners for `click` (on anchor links), `hashchange`, `popstate`.

* On anchor click:

  * Set a navigation-in-progress flag and force `#floating-nav` visible.

  * Smoothly scroll (respect existing behavior) without hiding the navbar.

  * Reset the flag after navigation settles.

* On `hashchange`/`popstate`:

  * Keep `#floating-nav` visible.

  * Update internal scroll baseline to avoid misclassifying direction.

* Update existing `scroll` logic to ignore hide/show decisions while navigation is in progress.

## State Management

* Introduce an FSM-like state:

  * `hidden`, `visible`, `navLock` (locked visible during navigation).

* Variables:

  * `navigationInProgress` (boolean)

  * `lastY` (number), reused from current implementation

* Transitions:

  * `click(anchor)` → `navLock` for 600–900ms or until `scrollend`

  * `hashchange/popstate` → maintain `visible`; update `lastY`

  * `scroll` while `navLock` → no state change

## CSS Guarantees

* Ensure `position: fixed`, bottom-centered, and `z-index` > content and back-to-top button.

* Add `will-change: transform` for smooth slide-up.

* Preserve pointer interactions: `pointer-events: auto`.

* Keep backdrop blur with fallback background if blur unsupported.

## Implementation Outline

* index.html (script):

```
const floatingNav = document.getElementById('floating-nav');
let navigationInProgress = false;
let lastY = window.pageYOffset || 0;

function lockNavVisible() {
  navigationInProgress = true;
  floatingNav.classList.add('visible');
}
function unlockNavVisible() {
  navigationInProgress = false;
}

function onAnchorClick(e) {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    lockNavVisible();
    setTimeout(unlockNavVisible, 800);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', onAnchorClick));

window.addEventListener('hashchange', () => {
  lockNavVisible();
  lastY = window.pageYOffset || 0;
  setTimeout(unlockNavVisible, 500);
});

window.addEventListener('popstate', () => {
  lockNavVisible();
  lastY = window.pageYOffset || 0;
  setTimeout(unlockNavVisible, 500);
});

function onScroll() {
  if (navigationInProgress) return;
  const y = window.pageYOffset || 0;
  const dirDown = y > lastY;
  const nearTop = y < 120;
  if (dirDown && y > 200) floatingNav.classList.add('visible');
  else if (!dirDown || nearTop) floatingNav.classList.remove('visible');
  lastY = y;
}
window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
```

* styles.css:

```
.float-navbar { position: fixed; z-index: 1100; will-change: transform; pointer-events: auto; }
@supports not (backdrop-filter: blur(10px)) {
  .float-navbar { background: rgba(20,25,35,0.85); }
}
```

## Testing Plan

* Manual navigation:

  * Click each navbar link (`#about`, `#education`, `#projects`, `#skills`, `#contact-us`) from various scroll positions.

  * Use browser back/forward across fragments.

  * Trigger rapid consecutive fragment navigations.

* Screen sizes:

  * Test mobile (portrait/landscape), tablet, desktop; verify position, z-index over content and back-to-top.

* Interaction:

  * Verify links in floating navbar remain clickable and not blocked by content.

* Automated smoke test (console):

```
const ids = ['about','education','projects','skills','contact-us'];
(async () => {
  for (const id of ids) {
    location.hash = id;
    await new Promise(r => setTimeout(r, 400));
    console.assert(document.getElementById('floating-nav').classList.contains('visible'));
  }
})();
```

## Performance & Accessibility

* Use passive listeners for scroll; minimal work in handlers.

* Keep animations GPU-friendly via `transform`.

* Maintain accessible `role="navigation"` and `aria-label`.

## Deliverables

* JS integration for fragment-aware visibility management.

* CSS adjustments guaranteeing position and stacking.

* Test script and checklist results.

## Next Step

* Confirm the plan to proceed with implementing

