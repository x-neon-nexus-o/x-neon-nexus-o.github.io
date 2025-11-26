# Portfolio Custom Cursor

## Overview
- Adds a dual-layer custom cursor (ring + dot) aligned to the site accent color.
- Provides smooth animations, interactive hover/active feedback, responsive behavior, and touch fallbacks.
- Respects user accessibility preferences and keeps native focus indicators intact.

## Files
- `assets/css/cursor.css`: Styling for cursor ring/dot and state classes.
- `assets/js/cursor.js`: Behavior, animations, delegation for interactive elements, section transition, metrics.
- Integrated in `index.html` and `thanks.html`.

## Installation
- Already included via `<link>` and `<script>` in `index.html` and `thanks.html`.
- Accent color uses `--accent-color` if set; falls back to `#02aaff`.

## Style Guide
- Default: ring `32px`, border `2px`, dot `8px`, `mix-blend-mode: difference`.
- Hover (`cursor--interactive`): ring scale `1.25`.
- Active (`cursor--active`): ring scale `0.9`, minor opacity pulse.
- Section transition (`cursor--section-transition`): brief ring scale `1.1` on `hashchange`.
- Hidden (`cursor-hidden`): opacity `0` during tab hide.
- Reduced motion: animations disabled when `prefers-reduced-motion: reduce`.
- Touch/coarse pointer: cursor hidden via media query and touchstart.

## Accessibility (WCAG 2.1)
- Honors `prefers-reduced-motion` and disables animation.
- Cursor elements are `aria-hidden` and `role="presentation"` and never intercept pointer events.
- Keyboard navigation preserved; native focus outlines unaffected.
- Contrast maintained with `mix-blend-mode: difference`; fallback is visible on common backgrounds.

## Performance Optimization
- Single `requestAnimationFrame` smoothing loop; CSS transforms only.
- Passive event listeners; minimal DOM writes via class toggles.
- Brief `will-change` use avoided; transform updates kept efficient.

## Performance Metrics
- Runtime metrics exposed via `window.cursorMetrics` on `beforeunload`:
  - `avgFrameMs`: average RAF frame delta in milliseconds.
  - `maxFrameMs`: maximum RAF frame delta in milliseconds.
  - `pointerEvents`: number of `pointermove` events processed.
  - `sessionMs`: session duration in milliseconds.
- View metrics: open devtools and inspect `window.cursorMetrics` after navigation away or page close.

## Cross-Browser Testing
- Chrome, Firefox, Edge: smooth transforms, `mix-blend-mode: difference` renders correctly, media queries work.
- Safari: `mix-blend-mode: difference` generally supported; behavior verified with dark/video backgrounds.
- Fallbacks: coarse pointer and `hover: none` hide cursor; reduced motion disables animations.

## Validation Checklist
- Reduced motion honored.
- Interactive elements trigger hover feedback.
- Click feedback visible and brief.
- Cursor hidden on touch devices.
- No interference with text selection or form inputs.
- No layout thrashing; only transform updates.

## How To Verify Locally
- Open `index.html` and move the pointer across links and buttons; observe ring scale changes.
- Click anywhere; observe brief active feedback.
- Navigate between sections via nav; observe subtle transition.
- Emulate mobile/touch in devtools; cursor should hide.
- Toggle reduced motion in OS/browser; animations should stop.

## Notes
- Accent color adapts to theme customizer via `--accent-color`.
- Metrics are approximate and vary by device load and browser.
