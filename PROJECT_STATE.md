# Silly Slice — Project State

## Quick links
- Repo: https://github.com/michaelm602/sillyslice-site
- Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/

## Current goal
Build a cute + playful multi-page storefront site (React + Vite) with:
- Home, Shop, About, Contact
- Later: admin uploads, inventory tracking, made-to-order lead times, PayPal checkout
Hosting later on DigitalOcean + custom domain (GoDaddy). For now: GitHub Pages.

## Tech stack
- Vite + React
- React Router (NavLink routes)
- CSS variables theme + light/dark via `prefers-color-scheme`
- Styling currently done in `src/index.css` (theme tokens + component classes)

## What works right now
- Git is initialized, SSH auth working, pushing to GitHub works
- GitHub Pages is live + updates when pushing
- Home + Shop pages are styled with the new “cute/playful” gradient theme
- Shop cards now use class-based styling (`.product-card`, `.product-image`, etc.)
- Navbar active tab has the cute highlight styling

## Files changed / key files
- `src/index.css`
  - Theme tokens: `--accent`, `--accent2`, `--accent3`
  - Background uses `radial-gradient` + `color-mix`
  - Buttons: `.btn`, `.btn-primary`, `.btn-disabled`
  - Shop: `.shop-page`, `.shop-top`, `.product-grid`, `.product-card`, badges, etc.
- `src/pages/Shop.jsx` (or wherever it lives)
  - Replaced inline styles with class names: `product-card`, `product-image`, `product-row`, etc.
- `src/components/Navbar.jsx`
  - Uses `NavLink` + active styling (needs final “cute” class-based styling if not done yet)

## Known issues / notes
- Some components still use inline styles — should migrate to classes for consistent theming.
- If any gradients don’t show on some browsers, `color-mix()` support may be the reason.

## Next up (priority order)
1) Convert Navbar to use CSS classes fully (no inline styling), matching the new theme
2) Add hover/focus states for navbar links and buttons consistently
3) Style About + Contact pages to match
4) Mobile polish (spacing + nav wrap + card layout)
5) Add real product images later via admin uploads
