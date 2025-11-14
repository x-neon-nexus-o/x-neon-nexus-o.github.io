## Approach

- Create a fixed-top navbar (`#scroll-up-nav`) that clones the existing main navbar links and the Hire Me button for consistency.
- Use scroll direction detection with `requestAnimationFrame` and a 250ms appearance delay to avoid flicker.
- Hide on downward scroll immediately; show on upward scroll after delay.
- CSS transitions with `transform` for smooth slide-in from the top and high `z-index` layering.

## Implementation Steps

1. Markup:
- Add a new `nav` element at the end of `body`:
```
<nav id="scroll-up-nav" class="scroll-navbar" role="navigation" aria-label="Scroll Navigation">
  <div class="scroll-navbar-inner">
    <div id="scroll-nav-list" class="scroll-nav-list"></div>
  </div>
</nav>
```

2. CSS:
- Fixed top, hidden by default via `transform: translateY(-105%)` and visible with `.visible` → `translateY(0)`.
- Glassy blurred background, rounded corners, shadow, responsive layout; `will-change: transform`, `pointer-events: auto`, `z-index: 1200`.
- Horizontal scroll for overflow on small screens.

3. JS:
- Clone links from `#navcol-5` into `#scroll-nav-list`.
- Track `lastY`, compute `directionUp = y < lastY`.
- On upward scroll, set `wantVisible = true` and start a 250ms timer; when it fires and still `wantVisible`, add `.visible`.
- On downward scroll, cancel timer and remove `.visible`.
- Use passive listeners and `requestAnimationFrame` to keep scrolling smooth.

4. Non-interference:
- Ensure fixed overlay doesn’t push content; maintain proper stacking and pointer events.

5. Testing:
- Manual across breakpoints: mobile portrait/landscape, tablet, desktop.
- Optional harness: parameter triggers scripted scroll sequence to verify appearance/disappearance.

## Deliverables
- Markup, CSS, and JS integrated into existing files.
- Optional test harness to quickly verify behavior.

## Proceeding
- Implement as above and verify behavior end-to-end.