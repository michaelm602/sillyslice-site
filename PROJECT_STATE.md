Silly Slice — Project State (Updated)
🔗 Quick links

Repo: https://github.com/michaelm602/sillyslice-site

Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

🎯 Current goal

Build a cute + playful multi-page storefront (React + Vite) with a polished mobile experience:

Pages: Home, Shop, About, Contact

Placeholder products + images for now

Future:

Admin uploads

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

/sillyslice-site/#/about

/sillyslice-site/#/contact

Placeholder images render correctly in local + production

Navbar active tab styling matches playful gradient theme

Shop page renders product mock data into styled cards

Mobile navigation (recently completed)

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

CTA buttons inside drawer no longer stretch or grow unexpectedly

Drawer CTA (“Custom request”) now sizes correctly and matches theme

🖼 Images setup (current)

Placeholder images stored in:
public/products/*

Product data references images using absolute paths:

image: "/products/placeholder1.png"


Images render correctly on both localhost and GitHub Pages

📁 Key files
src/index.css

Theme tokens:

--accent, --accent2, --accent3

Global background gradients

Buttons:

.btn, .btn-primary, .btn-disabled

Shop layout + cards:

.shop-page, .product-grid, .product-card

.product-image-wrap, badges, CTA styles

Navbar + mobile drawer styling:

.nav, .nav-toggle, .drawer, .drawer-overlay

Mobile spacing + sizing fixes

Drawer CTA hard-clamped to prevent stretching

src/components/Navbar.jsx

Desktop + mobile navigation logic

Mobile drawer state handling

Swipe-to-close logic using pointer events

Overlay click-to-close

ESC key handling

Auto-close on breakpoint change

Scroll locking when drawer is open

src/pages/Shop.jsx

Uses mock product data

Maps products into styled cards

Category filter placeholder in place

src/data/products.js

Product objects include:

name

description

stock

image (single image per product for now)

src/App.jsx / src/main.jsx

Uses HashRouter so refresh works on GitHub Pages

⚠️ Known issues / notes

Some placeholder images appear slightly zoomed depending on aspect ratio
(expected with random portrait/landscape sources)

Console warnings observed:

ARIA focus warning (resolved by using hidden instead of aria-hidden)

Browser extension runtime warnings (safe to ignore)

No real checkout yet (buttons are visual placeholders only)

⏭️ Next up (priority order)

Image polish (no layout changes)

Add image load fade-in

Auto-handle portrait vs landscape consistently

Ensure images never look cropped or awkward
(future-proof for Audrey uploads 😭)

Prep for Firebase image URLs

Keep card layout stable

Swap image paths from /public/products/* → Firebase Storage URLs later

Mobile polish pass

Final spacing tweaks

Verify drawer behavior across devices

Thumb-reach comfort check

Admin groundwork (later)

Scaffold upload flow

Plan inventory + lead time fields

Wire PayPal checkout