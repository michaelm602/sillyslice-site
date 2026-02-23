// src/data/siteContent.js
const base = import.meta.env.BASE_URL;

export const localSiteContent = {
    brandName: "Silly Slice",
    hero: {
        image: `${base}hero/printer.jpg`,
        headline: "Cute sensory toys, made with love",
        subhead: "3D-printed fidgets, for busy hands and loud brains.",
        ctaText: "Shop now",
        ctaTo: "/shop",
        secondaryText: "Request custom colors",
    },
    home: {
        nextTitle: "Made to order, made for you",
        nextItems: [
            "Pick your colors when you place a request",
            "Every toy is printed fresh — no mass-produced shortcuts",
            "Ships within the lead time shown on each product page",
            "Questions? Contact us — we reply fast",
        ],
        featuredTitle: "Featured toys",
        featuredSubtitle: "Our most popular picks, ready to order.",
    },
    shop: {
        title: "Shop",
        subtitle: "Fresh drops and made-to-order goodies.",
        emptyTitle: "More toys coming soon",
        emptyText: "We're printing new inventory. Check back soon or contact us for a custom order.",
    },
    footer: { copyright: "© Silly Slice" },
};
