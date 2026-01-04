Silly Slice — Project State (Updated)
🔗 Quick links

Repo: https://github.com/michaelm602/sillyslice-site
Live (GitHub Pages): https://michaelm602.github.io/sillyslice-site/#/

🎯 Current goal

Build a cute + playful multi-page storefront (React + Vite) with a polished mobile experience.

Pages:
- Home
- Shop
- About
- Contact

Current approach:
- Placeholder products + images (local public/*)
- Reusable card component for product display (ToyCard)
- Featured section pulls from products data (no hardcoded featured array)

Future:
- Admin uploads (Firebase)
- Inventory tracking
- Made-to-order lead times
- PayPal checkout
- Hosting later on DigitalOcean + custom domain (GoDaddy)
- For now: GitHub Pages

🧱 Tech stack

- Vite + React
- React Router (HashRouter)
  - Required for GitHub Pages refresh support
- CSS variables theme
- Auto light/dark via prefers-color-scheme
- Styling centralized in src/index.css
- gh-pages deployment: build → deploy dist

✅ What works right now
Core
- GitHub Pages deploy is stable
- Routing works correctly with hash routes:
  - /sillyslice-site/#/
  - /sillyslice-site/#/shop
  - /sillyslice-site/#/about
  - /sillyslice-site/#/contact
- Placeholder images render correctly in local + production (after fixing path strategy)
- Navbar active tab styling matches playful gradient theme
- Shop page renders product mock data into styled cards

Reusable UI architecture (NEW)
- ToyCard component created and integrated
  - Used by both Home “Featured” section and Shop product list
  - Supports:
    - product prop (name, image, description, price, qty, fulfillment, leadDays)
    - href + linkText (CTA)
    - fallbackImg for broken images
- Home featured cards now match Shop card visual style (clean + consistent)

Featured system (NEW)
- Added featuredRank field to products in src/data/products.js
  - featuredRank: 1, 2, 3… determines ordering
- Featured section is no longer hardcoded
  - It pulls featured items from products data

Hook architecture (NEW)
- useFeaturedProducts() hook added (in src/hooks/)
  - Centralizes “featured” logic:
    - filter products with numeric featuredRank
    - sort by featuredRank ascending
    - slice to limit (default 4)
  - Prevents duplicating featured logic across pages

Mobile navigation (completed earlier)
- Mobile drawer navigation implemented
- Hamburger menu shows only on mobile
- Desktop nav hidden correctly on small screens
- Drawer features:
  ✅ Tap outside (overlay) closes drawer
  ✅ Swipe right to close (touch + mouse)
  ✅ ESC key closes drawer
  ✅ Auto-closes when resizing to desktop
  ✅ Background scroll locked while open
- Drawer flicker eliminated during open/close
- Drawer background opacity increased (less see-through, more readable)
- CTA buttons inside drawer no longer stretch or grow unexpectedly
- Drawer CTA (“Custom request”) now sizes correctly and matches theme

🖼 Images setup (current)

Placeholder images stored in:
- public/products/*
Hero image stored in:
- public/hero/printer.jpg
Brand images stored in:
- public/logo-hero.png, etc.

IMPORTANT: GitHub Pages path gotcha
- Image paths must respect Vite base path for production builds.
- Current stable strategy:
  - In products.js: use `const base = import.meta.env.BASE_URL;` and build image like:
    image: `${base}products/placeholder1.png`
  - In pages/components: don’t hardcode "/products/..." unless you intentionally want root paths.
- This fixed GitHub “404 Not Found” image issues when moving to ToyCard.

📁 Key files

src/index.css
- Theme tokens:
  --accent, --accent2, --accent3
- Global background gradients
- Buttons:
  .btn, .btn-primary, .btn-disabled
- Shared card grids:
  .toy-grid, .toy-card, image wraps, badges, CTA styles
- Navbar + mobile drawer styling:
  .nav, .nav-toggle, .drawer, .drawer-overlay
- Mobile spacing + overflow fixes
- Drawer CTA hard-clamped to prevent stretching

src/components/ToyCard.jsx (NEW)
- Shared product card renderer for Home + Shop
- Handles badge logic + stock text + safe fallback image

src/hooks/useFeaturedProducts.js (NEW)
- Exports useFeaturedProducts(limit = 4)
- Central featured logic: filter + sort + slice

src/pages/Home.jsx
- Hero uses BASE_URL for background + logo:
  url("${base}hero/printer.jpg")
  src={`${base}logo-hero.png`}
- Featured section now uses:
  const featured = useFeaturedProducts()
  and maps <ToyCard />

src/pages/Shop.jsx
- Uses mock product data
- Maps products into ToyCard for consistent UI
- Category filter placeholder in place

src/data/products.js
- Exports categories + products
- Product objects include:
  id, name, price, category, fulfillment, qty, leadDays, description, image
- NEW: featuredRank for featured selection + ordering
- Uses BASE_URL for image paths to keep GitHub Pages happy

src/App.jsx / src/main.jsx
- Uses HashRouter so refresh works on GitHub Pages

⚠️ Known issues / notes

- If you declare `const featured` twice in Home.jsx, Vite will throw:
  “Identifier 'featured' has already been declared”
  Fix: use the hook OR inline logic — never both.
- Console warnings observed:
  - Browser extension runtime warnings (safe to ignore)
- No real checkout yet (buttons are visual placeholders only)

⏭️ Next up (priority order)

1) Finish “Featured” extraction cleanly everywhere
- Home uses useFeaturedProducts()
- Shop stays filtered by category, but uses ToyCard

2) Image polish (no layout changes)
- Add image load fade-in (optional: shimmer)
- Auto-handle portrait vs landscape consistently
- Ensure images never look cropped or awkward (future-proof for Audrey uploads 😭)

3) Prep for Firebase image URLs
- Keep ToyCard stable
- Swap product.image from BASE_URL public assets → Firebase Storage URLs later
- (Hook architecture already makes this future change easier)

4) Mobile polish pass
- Final spacing tweaks
- Verify drawer behavior across devices
- Thumb-reach comfort check

5) Admin groundwork (later)
- Scaffold upload flow
- Plan inventory + lead time fields
- Wire PayPal checkout
