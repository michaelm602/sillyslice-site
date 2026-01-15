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

Admin (/admin, auth-protected) ✅ (working + responsive)

Login (/login) ✅

🧱 Tech stack

Vite + React

React Router (HashRouter) — GitHub Pages safe

CSS variables theme (dark + light via prefers-color-scheme)

Styling centralized in src/index.css

Firebase

Firestore ✅

Auth ✅

Storage ✅

gh-pages deploy (build → dist → deploy)

✅ What works right now
Deployment + routing

Stable GitHub Pages deployment ✅

Routing works with hash routes ✅

Mobile responsive across pages ✅

Shop + product experience

Shop grid + product cards polished ✅

Product detail page:

Hero image ✅

Thumbnail gallery ✅

Stock/price/badges ✅

Custom Lightbox ✅

Custom Lightbox (no library)

Fixed viewport overlay ✅

Always centered (no scroll drift) ✅

No image cropping ✅

Keyboard nav (ESC / arrows) ✅

Swipe support on mobile ✅

Fixed z-index conflicts with navbar ✅

SafeImage component

Handles cached images cleanly ✅

Prevents flicker ✅

Lazy loading + async decoding ✅

Admin system (real, not fake)

Admin page exists and is responsive ✅

Secure login flow ✅

Can upload main image ✅

Can multi-upload gallery images ✅

Can reorder gallery via drag/drop ✅

Can set hero image ✅

Can delete images ✅ (working and committed)

Can edit draft product fields ✅

Can publish draft ✅

Firebase security / access

Firebase Auth has two admin users:

michaelm602@yahoo.com

sillyslice7@gmail.com

Authorized domains updated ✅:

Includes michaelm602.github.io (GH Pages OAuth-safe)

Storage rules locked to admin emails ✅

Firestore rules locked to admin emails ✅

Public read for products + siteContent

Admin-only write

Static asset / placeholder fix

Fixed 404 spam for missing placeholder images by ensuring proper public path handling ✅

🔧 Recent fixes & improvements

✅ Fixed lightbox centering bug (grid/transform interaction)

✅ Fixed lightbox image oversizing

✅ Locked lightbox layout to a single grid cell

✅ Prevented background scroll while lightbox is open

✅ Removed image cropping across product cards + hero

✅ Reduced mobile flicker and animation jitter

✅ Fixed z-index conflicts (navbar vs overlays)

✅ Added image deletion (Storage + Firestore updates)

✅ Admin page made responsive

✅ Firebase Auth authorized domain added for GH Pages

🧠 Current approach

Products stored in Firestore with draft → publish workflow

Shop displays “published-ish” items (active + image)

Layout stays locked; content is the only editable layer

Images live in Firebase Storage and are referenced in Firestore

🚧 Next planned steps (priority order)
1) Admin quality-of-life (high leverage)

Add “Shop visibility” checklist per product (active/image/price/etc.)

Add publish confirmation / guardrails (avoid accidental live changes)

Add “Create new product” + “Duplicate product” actions

Add optional “Discard draft” action

2) Product + inventory readiness

Add basic inventory fields validation (qty vs leadDays depending on fulfillment)

Add optional “inactive” hiding behavior clearly in Admin

3) Customer checkout path (staged approach)

Add “Request Order” flow now (contact form prefilled from product)

Later: PayPal checkout integration (Stripe later if needed)

4) Performance polish

Image compression workflow (webp/jpg sizing strategy)

Preload hero image only (avoid overfetch)

Optional: srcset later

5) Hosting / domain (future)

Custom domain (sillyslice.com)

Add authorized domains:

sillyslice.com

www.sillyslice.com

Optional move off GH Pages later

🧨 Non-goals (for now)

No design overhaul

No animation-heavy gimmicks

No external UI libraries for core features (lightbox, cards, nav)

If you want my vote on what we hit next: “Create new product + Shop visibility checklist” — because that’s the moment Audrey stops needing you to babysit the catalog and can run the store like it’s a real storefront, not a science project.