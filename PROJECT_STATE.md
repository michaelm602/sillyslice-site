Silly Slice — Project State (Updated)
🔗 Quick links

Repo: https://github.com/michaelm602/sillyslice-site

Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

🎯 Current goal

Build a cute + playful multi-page storefront (React + Vite) with a polished mobile experience — with content editable for Audrey (data/content only, not layout).

🧭 Pages

Home

Shop

About

Contact

Product Detail (NEW): /shop/:id

Admin (NEW): /admin (auth-protected)

🧱 Tech stack

Vite + React

React Router (HashRouter)

GitHub Pages refresh support

CSS variables theme

Auto light/dark via prefers-color-scheme

Styling centralized in src/index.css

gh-pages deployment: build → deploy dist

Firebase

Firestore

Auth

Storage (wired, used later)

✅ What works right now
Core routing + deploy

GitHub Pages deploy is stable

Routing works correctly with hash routes:

/sillyslice-site/#/

/sillyslice-site/#/shop

/sillyslice-site/#/shop/:id ✅

/sillyslice-site/#/about

/sillyslice-site/#/contact

/sillyslice-site/#/admin ✅ (requires login)

UI

Navbar active tab styling matches playful gradient theme

Mobile drawer works + swipe-to-close

Shop renders mock product data into styled ToyCards

Product detail pages render correctly (“View →”)

SafeImage + shimmer loading works (no ugly image pop-in)

🧩 Reusable UI architecture
ToyCard component used by:

Home “Featured”

Shop grid

Supports:

product prop: name, image, description, price, qty, fulfillment, leadDays

to (React Router navigation) + linkText

fallbackImg

Uses SafeImage + shimmer overlay

⭐ Featured system

featuredRank added to products in src/data/products.js

Featured is not hardcoded

useFeaturedProducts() hook centralizes logic:

filter products with numeric featuredRank

sort asc

slice to limit (default 4)

fallback fill

DEV safety:

warns on duplicate featuredRank in dev only (import.meta.env.DEV)

🆕 Firebase integration (DONE this session)
Firebase setup

src/firebase.js created and wired:

Firestore (db)

Auth (auth)

Storage (storage)

.env.local is used for Firebase keys (VITE_FIREBASE_*)

File lives at project root, same level as package.json

Firestore content system

Firestore collection: siteContent

Document: siteContent/main

Local fallback content lives in:

src/data/siteContent.js

renamed export: localSiteContent (prevents naming collisions)

Hook created/fixed:

src/hooks/useSiteContent.js

Pulls Firestore doc if present

Deep merges remote over local fallback so missing Firestore keys never crash UI

Returns: { content, usingRemote, loading, error }

Admin status + seeding

src/pages/Admin.jsx shows:

“Connected to Firestore” vs “Using local fallback”

JSON preview of merged content

Admin includes a Seed button:

writes localSiteContent into Firestore (siteContent/main)

guarantees full schema exists (no partial-doc white screens)

🛡️ Auth + Admin route (DONE this session)

/admin is protected with:

src/components/RequireAuth.jsx using react-firebase-hooks/auth

redirects to / if not logged in

Admin login is via Firebase Auth (email/password)

🆕 Navbar admin controls (DONE this session)

Navbar shows Admin + Log out when a user is logged in:

visible in desktop nav

visible in mobile drawer

Logout signs out and navigates home

🆕 Product detail page (NEW)

src/pages/Product.jsx

Route: /shop/:id

Pulls product by id from local products data (for now)

Shows image, name, price, stock/fulfillment badge, description

“Back to shop” link

Disabled “Add to cart (coming soon)” placeholder CTA

Shop + Featured cards link to product pages:

#/shop/${p.id} (handled via to="/shop/:id" in ToyCard now)

🖼 Images setup (current)

Placeholder images: public/products/*

Hero image: public/hero/printer.jpg

Brand images: public/logo-hero.png, public/logo-mark-*.png, etc.

GitHub Pages path gotcha solved

Must respect Vite base path in production

Using:

import.meta.env.BASE_URL

Vite config:

base: mode === "production" ? "/sillyslice-site/" : "/"

📁 Key files (current)

src/index.css (theme, navbar, drawer, cards, shimmer, responsive)

src/firebase.js (Firebase init)

src/data/siteContent.js (localSiteContent fallback + seed source)

src/hooks/useSiteContent.js (Firestore-first w/ deep-merge fallback)

src/components/RequireAuth.jsx (protects /admin)

src/pages/Admin.jsx (status + JSON preview + seed)

src/components/SafeImage.jsx

src/components/ToyCard.jsx

src/pages/Home.jsx (uses merged site content safely)

src/pages/Shop.jsx

src/pages/Product.jsx

src/data/products.js (local products + categories + featuredRank)

src/App.jsx (routes incl /admin)

⚠️ Notes

White screen issues were caused by:

renamed export (siteContent → localSiteContent) without updating imports

Firestore doc being partial (only brandName) while UI expected hero/home

Fixed by:

aligning exports/imports

deep merge fallback in useSiteContent

⏭️ Next up (priority order)
1) Products → Firestore (next session)

Firestore collection: products (doc id = product id)

Build:

seed from local products.js

useProducts() hook with Firestore-first + local fallback (same pattern as siteContent)

2) Admin: Audrey-safe editing UI

/admin content controls (no JSON editing)

edit hero: headline/subhead/CTA text + CTA route

edit home sections

edit shop empty state copy

Later: draft/publish workflow for preview mode

3) Storage uploads

Storage folders:

hero/

products/

(later) products-videos/

Upload UI in admin + store URLs in Firestore

4) Shop polish

Move Shop page copy to Firestore-driven siteContent.shop

Empty state uses siteContent.shop.emptyTitle/emptyText

5) Checkout groundwork (later)

Add-to-cart state (local)

PayPal checkout integration

Inventory + lead time fields supported in admin