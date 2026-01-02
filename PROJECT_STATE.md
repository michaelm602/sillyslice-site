Silly Slice — Project State (Updated)
Quick links

Repo: https://github.com/michaelm602/sillyslice-site

Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

Current goal

Build a cute + playful multi-page storefront site (React + Vite) with:

Home, Shop, About, Contact

Placeholder products + images now

Later: admin uploads, inventory tracking, made-to-order lead times, PayPal checkout
Hosting later on DigitalOcean + custom domain (GoDaddy). For now: GitHub Pages.

Tech stack

Vite + React

React Router HashRouter (required for GitHub Pages refresh support)

CSS variables theme + auto light/dark via prefers-color-scheme

Styling currently centralized in src/index.css

gh-pages deployment: build → deploy dist

What works right now

GitHub Pages deploy is working

Routing is stable on GitHub Pages using hash routes:

/sillyslice-site/#/

/sillyslice-site/#/shop

Shop page uses product mock data and renders cards

Placeholder images now show correctly in production

Navbar active tab styling works with the “cute/playful” gradient theme

Product cards use class-based styling (consistent theme)

Images setup (current)

Placeholder images stored in: public/products/*

Product data references images using absolute paths like:

image: "/products/placeholder1.png"

Images render on both local + GitHub Pages now.

Key files

src/index.css

Theme tokens: --accent, --accent2, --accent3

Background gradients

Buttons: .btn, .btn-primary, .btn-disabled

Shop layout + card styles: .shop-page, .product-grid, .product-card, .product-image, badges, etc.

src/pages/Shop.jsx

Uses products + categories from data file

Maps products into styled cards

src/data/products.js

Product objects now include image string (single image per product for now)

src/App.jsx / src/main.jsx

Uses HashRouter so refresh works on GitHub Pages

Known issues / notes

Some placeholder images look “zoomed/cropped” depending on aspect ratio.

Current intent: make image area resilient to random portrait/landscape uploads (Audrey will absolutely do this 😭)

Local dev refresh may warn about base URL if vite.config.js base is set; use the recommended path or keep dev links consistent.

Next up (priority order)

Image polish (no layout changes):

Add image load fade-in (nice premium feel)

Auto-handle portrait vs landscape consistently

Ensure images never look “cropped weird” even if uploaded sizes vary

Prep for Firebase image URLs later:

Keep product card layout stable

Only swap image values from /public/products/* → Firebase Storage URLs when ready

Mobile polish pass (spacing + grid + navbar wrapping)

Start scaffolding admin upload flow (later)