Silly Slice — Project State (Updated)
🔗 Quick links

Repo: https://github.com/michaelm602/sillyslice-site

Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

🎯 Current goal
Build a cute + playful multi-page storefront (React + Vite) with a polished mobile experience — with content editable for Audrey (data/content only, not layout).

Pages:

Home

Shop

About

Contact

Product Detail (NEW): /shop/:id

Current approach:

Placeholder products + images (local public/*)

Reusable card component for product display (ToyCard)

Featured section pulls from products data (no hardcoded featured array)

Editable copy centralized in siteContent.js (NEW)

Future:

Admin uploads (Firebase)

Inventory tracking

Made-to-order lead times

PayPal checkout

Hosting later on DigitalOcean + custom domain (GoDaddy)

For now: GitHub Pages

🧱 Tech stack

Vite + React

React Router (HashRouter)

Required for GitHub Pages refresh support

CSS variables theme

Auto light/dark via prefers-color-scheme

Styling centralized in src/index.css

gh-pages deployment: build → deploy dist

✅ What works right now

Core

GitHub Pages deploy is stable

Routing works correctly with hash routes:

/sillyslice-site/#/

/sillyslice-site/#/shop

/sillyslice-site/#/shop/:id (NEW)

/sillyslice-site/#/about

/sillyslice-site/#/contact

Placeholder images render correctly in local + production (after fixing path strategy)

Navbar active tab styling matches playful gradient theme

Shop page renders product mock data into styled cards

Product detail pages render correctly when clicking “View →” (NEW)

Reusable UI architecture

ToyCard component created and integrated

Used by both Home “Featured” section and Shop product list

Supports:

product prop (name, image, description, price, qty, fulfillment, leadDays)

href + linkText (CTA)

fallbackImg for broken images

Uses SafeImage + shimmer overlay for smooth loading

Home featured cards match Shop card visual style (consistent UI)

Featured system

Added featuredRank field to products in src/data/products.js

featuredRank: 1, 2, 3… determines ordering

Featured section is no longer hardcoded

It pulls featured items from products data

Hook architecture

useFeaturedProducts() hook added (in src/hooks/)

Centralizes featured logic:

filter products with numeric featuredRank

sort by featuredRank ascending

slice to limit (default 4)

optional fallback fill if fewer than limit are ranked

DEV SAFETY: duplicate featuredRank warning added

Development only (import.meta.env.DEV)

Logs console.warn if two products share the same featuredRank

No production noise

Mobile navigation (completed earlier)

Mobile drawer navigation implemented

Hamburger menu shows only on mobile

Desktop nav hidden correctly on small screens

Drawer features:
✅ Tap outside (overlay) closes drawer
✅ Swipe right to close (touch + mouse)
✅ ESC key closes drawer
✅ Auto-closes when resizing to desktop
✅ Background scroll locked while open

Drawer flicker eliminated during open/close

Drawer background opacity increased (less see-through, more readable)

Drawer CTA (“Custom request”) now sizes correctly and matches theme

🆕 Editable content system (NEW)

src/data/siteContent.js added as centralized copy/content source

Goal: Audrey edits content (text/images/prices later via Firebase), not layout

Home now pulls hero/section copy from siteContent

Hero subhead, CTA text, secondary CTA text

“What we’re building next” title + list

Featured title + subtitle

Shop copy can be moved to siteContent.shop (if not already fully wired)

🆕 Product detail page (NEW)

Added src/pages/Product.jsx

Route added: /shop/:id

Product page behavior:

Pulls product by id from products.js

Shows image, name, price, stock/fulfillment badge, description

Includes “Back to shop” link

Includes disabled “Add to cart (coming soon)” CTA (placeholder)

Shop + Featured cards updated to link to product pages: #/shop/${p.id}

🖼 Images setup (current)
Placeholder images stored in:

public/products/*
Hero image stored in:

public/hero/printer.jpg
Brand images stored in:

public/logo-hero.png, etc.

IMPORTANT: GitHub Pages path gotcha

Image paths must respect Vite base path for production builds.

Current stable strategy:

In products.js: use const base = import.meta.env.BASE_URL; and build image like:
image: ${base}products/placeholder1.png

In components/pages: prefer BASE_URL-backed paths and avoid hardcoding /products/...

This fixed GitHub “404 Not Found” image issues when moving to ToyCard + SafeImage

📁 Key files
src/index.css

Theme tokens: --accent, --accent2, --accent3

Global background gradients

Buttons: .btn, .btn-primary, .btn-disabled

Shared card grids: .toy-grid, .toy-card, image wraps, badges, CTA styles

Navbar + mobile drawer styling: .nav, .nav-toggle, .drawer, .drawer-overlay

Mobile spacing + overflow fixes

Drawer CTA hard-clamped to prevent stretching

Image shimmer + load transitions used by cards

src/data/siteContent.js (NEW)

Centralized editable content (hero + home sections + shop copy + footer text)

src/components/SafeImage.jsx

Handles lazy loading, async decoding, load state, fallback image

src/components/ToyCard.jsx

Shared product card renderer for Home + Shop

Uses SafeImage and shimmer overlay

Uses product.image (BASE_URL-friendly)

src/pages/Home.jsx

Uses siteContent for hero + copy

Featured section uses useFeaturedProducts() and maps <ToyCard />

Featured cards link to product pages

src/pages/Shop.jsx

Uses mock product data from products.js

Category filter exists (All + categories)

Renders filtered products into ToyCard

Product cards link to product pages

src/pages/Product.jsx (NEW)

Product detail page powered by route param /shop/:id

src/data/products.js

Exports categories + products

Product objects include:
id, name, price, category, fulfillment, qty, leadDays, description, image

featuredRank for featured selection + ordering

Uses BASE_URL for image paths

src/App.jsx / src/main.jsx

Uses HashRouter so refresh works on GitHub Pages

App routes now include /shop/:id

⚠️ Known issues / notes

If you declare const featured twice in Home.jsx, Vite will throw:
“Identifier 'featured' has already been declared”
Fix: use the hook OR inline logic — never both.

If products.js uses ${base} without defining const base = import.meta.env.BASE_URL;:
you'll get “base is not defined” and the page can blank.

Console warnings observed:

Browser extension runtime warnings (safe to ignore)

No real checkout yet (buttons are visual placeholders only)

⏭️ Next up (priority order)

Firebase integration (tomorrow)

Firestore collections:

products (id as doc key)

siteContent (single doc like main)

Storage folders: hero + product images

Auth + security rules: only Audrey/you can write

Add hooks: useProducts() + useSiteContent() with fallback to local JS

Add /admin route for Audrey-safe editing (content only, no layout)

Shop polish (minor, optional)

Shop empty state using siteContent.shop.emptyTitle/emptyText

Confirm category options map cleanly (id/name vs string array)

Image polish (no layout changes)

Keep shimmer + fade-in

Ensure portrait vs landscape always looks good for future uploads

Mobile polish pass

Verify product detail page on mobile (1-column layout)

Thumb-reach comfort check

Checkout groundwork (later)

Add-to-cart wiring (state only)

PayPal checkout integration

Inventory + lead time fields in admin