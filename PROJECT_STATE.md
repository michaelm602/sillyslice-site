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

“Request order” button ✅ (routes to Contact / inquiry flow)

Custom Lightbox ✅

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

✅ Admin system (real, not fake)

Admin page exists and is responsive ✅
Secure login flow ✅

Products admin

Can upload main image ✅

Can multi-upload gallery images ✅

Can reorder gallery via drag/drop ✅

Can set hero image ✅

Can delete images ✅ (working and committed)

Can edit draft product fields ✅

Can publish draft ✅

Shop visibility checklist ✅ (guardrails in place)

📨 Admin Inbox (NEW)

Admin now includes an Inquiries tab (inbox view) ✅

Inquiries stored in Firestore collection: inquiries ✅

Admin can view inquiries + details ✅

Status workflow supported ✅

new → in_progress → done (plus optional spam) ✅

Admin note field supported ✅ (saved back to Firestore)

Product thumbnail preview shown in inbox ✅ (visual context for Audrey)

Inquiry payload (snapshot model)

Inquiry stores a product snapshot, not just productId ✅

Includes id, name, image, fulfillment fields, qty, and price ✅

Slug is NOT used anywhere (ID-based routing: /shop/:id) ✅

Product image fallback to placeholder if missing ✅

(Planned/optional) snapshotAt: serverTimestamp() — discussed as upgrade

🔐 Firebase security / access

Firebase Auth has two admin users:

michaelm602@yahoo.com

sillyslice7@gmail.com

Authorized domains updated ✅

Includes michaelm602.github.io (GH Pages OAuth-safe)

Storage rules locked to admin emails ✅
Firestore rules locked to admin emails ✅
Public read for products + siteContent ✅
Admin-only write ✅
(Inquiries: customer create allowed; admin-only read/update/delete) ✅ (in place / aligned with inbox approach)

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
✅ Added inquiries inbox in Admin
✅ Added inquiry product image thumbnail in inbox
✅ Inquiry stores product snapshot (no slug)

🧠 Current approach

Products stored in Firestore with draft → publish workflow
Shop displays “published-ish” items (active + image)
Layout stays locked; content is the only editable layer
Images live in Firebase Storage and are referenced in Firestore
Inquiries are Firestore docs (inquiries) and displayed in Admin inbox

🚧 Next planned steps (priority order)
Option A — Customer flow (business-facing)

Contact page: turn into a real inquiry form (name/email/message/qty) ✅/⏳ (depends what’s already wired)

Optional: EmailJS notification on new inquiry (email Audrey automatically) ⏳

Optional: auto-confirmation email to customer ⏳

Option B — Inbox polish (internal)

Filters: New / In progress / Done / Spam ⏳

“Archive” (soft delete) for inquiries instead of hard delete ✅ (recommended)

Optional: hard delete behind “type DELETE” confirm (admin-only) ⏳

Option C — Inventory polish (internal)

Soft validation warnings (not blockers)
Visual cues:

“Ready to ship: 0 left”

“Made to order: 5–7 days”
Optional archive (not delete) for retired products

Option D — Performance + polish

Image compression pipeline (admin-side)
Hero image preload only
Optional srcset later

Custom domain (sillyslice.com)
Add authorized domains:

sillyslice.com

www.sillyslice.com

Optional move off GH Pages later

🧨 Non-goals (for now)

No design overhaul
No animation-heavy gimmicks
No external UI libraries for core features (lightbox, cards, nav)

If you want, tomorrow we can do the next real move: turn Contact into a legit form + optionally EmailJS notify Audrey, then add Archive in the inbox so nothing gets deleted by accident.