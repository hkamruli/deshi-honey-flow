

## Optimize Performance, Fix Errors, and Improve Responsiveness

### 1. Fix Console Errors (FadeSection ref warnings)

Three components show "Function components cannot be given refs" warnings for `FadeSection`. The fix is to wrap `FadeSection` with `React.forwardRef` so it can accept refs properly.

**File:** `src/components/landing/FadeSection.tsx`

### 2. Remove Conflicting App.css

The `src/App.css` file contains default Vite template styles (`#root { max-width: 1280px; padding: 2rem }`) that constrain the layout and conflict with the landing page's full-width design. This file is not imported anywhere currently but should be cleaned up.

**File:** `src/App.css` -- clear its contents or remove conflicting rules

### 3. Improve StickyCTA Performance

The scroll listener in `StickyCTA` fires on every scroll event without throttling. Add `{ passive: true }` to the event listener for better scroll performance.

**File:** `src/components/landing/StickyCTA.tsx`

### 4. Improve Mobile Responsiveness

- **SolutionSection comparison table**: The 3-column grid is cramped on small screens. Switch to a stacked card layout on mobile.
- **ProductOptions grid**: `grid-cols-2` on small screens can be tight for 4 products. Keep as-is but ensure text doesn't overflow with `truncate` and smaller padding.
- **ValueStack**: The side-by-side layout on mobile needs better spacing.
- **HeroSection**: Ensure countdown timer digits don't overflow on very small screens.

**Files:** `src/components/landing/SolutionSection.tsx`, `src/components/landing/ProductOptions.tsx`

### 5. Add Smooth Page Transitions

Add a CSS `animate-fade-in` class to the main content wrapper for smoother initial load appearance.

**File:** `src/pages/Index.tsx`

### Technical Summary

| Change | File | Impact |
|--------|------|--------|
| Fix forwardRef warning | FadeSection.tsx | Eliminates 3 console errors |
| Remove conflicting CSS | App.css | Fixes potential layout constraints |
| Passive scroll listener | StickyCTA.tsx | Smoother scrolling performance |
| Mobile comparison table | SolutionSection.tsx | Better readability on small screens |
| Fade-in on load | Index.tsx | Smoother perceived loading |

