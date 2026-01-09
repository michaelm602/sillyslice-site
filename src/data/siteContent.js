// src/data/siteContent.js
const base = import.meta.env.BASE_URL;

export const localSiteContent = {
    brandName: "Silly Slice",
    hero: {
        image: `${base}hero/printer.jpg`,
        headline: "Cute sensory toys, made with love",
        subhead: "3D-printed fidgets and fun stuff for busy hands.",
        ctaText: "Shop now",
        ctaTo: "/shop",
        secondaryText: "Custom request",
    },
    home: {
        nextTitle: "What we’re building next",
        nextItems: [
            "Real product photos (uploaded by Audrey in admin)",
            "Inventory tracking (ready-to-ship counts)",
            "Made-to-order lead times",
            "PayPal checkout",
        ],
        featuredTitle: "Featured toys",
        featuredSubtitle:
            "(Placeholder for now — Audrey will upload the real product photos later.)",
    },
    shop: {
        title: "Shop",
        subtitle: "Placeholder products for now — Audrey will upload the real ones later.",
        emptyTitle: "Nothing here yet 😭",
        emptyText: "We haven’t dropped products in this category yet. Check back soon.",
    },
    footer: { copyright: "© Silly Slice" },
};
