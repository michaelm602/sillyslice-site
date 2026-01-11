Silly Slice — Project State (Updated)

🔗 Quick links
Repo: https://github.com/michaelm602/sillyslice-site

Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

🎯 Current goal

Build a cute + playful multi-page storefront (React + Vite) with a polished, mobile-first experience, where content is editable (data/content only — not layout).

🧭 Pages

Home ✅

Shop ✅

About ✅

Contact ✅

Product Detail (/shop/:id) ✅

Admin (/admin, auth-protected) ⏳ (scaffolded / planned)

🧱 Tech stack

Vite + React

React Router (HashRouter) — GitHub Pages safe

CSS variables theme (dark + light via prefers-color-scheme)

Centralized styling in src/index.css

Firebase (Firestore + Auth + Storage wired / partially used)

gh-pages deploy (build → dist → deploy)

✅ What works right now

Stable GitHub Pages deployment

Routing works correctly with hash routes

Responsive layout across mobile / tablet / desktop

Shop grid + product cards polished

Product detail page with:

Hero image

Thumbnail gallery

Stock / price / badges

Custom Lightbox (no library):

Fixed viewport overlay

Always centered (no scroll drift)

No image cropping

Keyboard nav (ESC / arrows)

Swipe support on mobile

SafeImage component:

Handles cached images cleanly

Prevents flicker

Lazy loading + async decoding

Navbar:

Desktop pills

Mobile drawer nav

Hero section:

Background image

Dark overlay for readability

Brand logo displayed larger and more legible

🔧 Recent fixes & improvements

✅ Fixed lightbox centering bug (caused by grid + transform interactions)

✅ Fixed lightbox image oversizing

✅ Locked lightbox layout to a single grid cell

✅ Prevented background scroll while lightbox is open

✅ Logo size in hero increased slightly using clamp() for better presence

✅ Removed image cropping across product cards + hero

✅ Reduced mobile flicker and animation jitter

✅ Fixed z-index conflicts (navbar vs overlays)

🧠 Current approach

Placeholder products + images (local / Firebase-ready)

Reusable card components shared between Home + Shop

Featured section pulls from product data (no hardcoded featured list)

Content copy centralized (siteContent pattern)

Layout remains locked; content is the only editable layer

🚧 Next planned steps

Admin page:

Upload / delete product images

Edit product data (name, price, stock, flags)

Replace placeholder images with real product photos

Inventory tracking (basic counts)

PayPal checkout (Stripe later if needed)

Optional hosting move to DigitalOcean + custom domain (future)

Performance polish (image compression + preload strategy)

🧨 Non-goals (for now)

No design overhaul

No animation-heavy gimmicks

No external UI libraries for core features (lightbox, cards, nav)