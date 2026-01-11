// src/data/products.js

export const categories = [
    { id: "fidget", name: "Fidgets" },
    { id: "sensory", name: "Sensory" },
    { id: "articulated", name: "Articulated" },
];

const base = import.meta.env.BASE_URL;
const PH = `${base}products/placeholder1.png`;

// src/data/products.js

export const PRODUCT_DEFAULTS = {
    id: "",
    name: "",
    price: 0,
    category: "fidget",
    fulfillment: "ready",        // "ready" | "made"
    leadDays: null,              // number | null
    qty: null,                   // number | null
    description: "",
    image: "",
    gallery: [],                 // ✅ NEW
    featuredRank: null,
    active: true,                // ✅ NEW
};


export const products = [
    {
        id: "gear-clicker",
        name: "Gear Clicker",
        price: 9.99,
        category: "fidget",
        fulfillment: "ready",
        qty: 12,
        description: "Clicky little gear toy. Loud enough to annoy your enemies.",
        image: PH,
        featuredRank: 1,
    },
    {
        id: "spiral-snake",
        name: "Spiral Snake",
        price: 14.99,
        category: "sensory",
        fulfillment: "made",
        leadDays: 3,
        qty: null,
        description: "Smooth, wiggly, oddly satisfying. Made-to-order.",
        image: `${base}products/placeholder2.webp`,
        featuredRank: 2,
    },
    {
        id: "mini-dragon",
        name: "Mini Articulated Dragon",
        price: 19.99,
        category: "articulated",
        fulfillment: "ready",
        qty: 5,
        description: "Flexy dragon friend. No feeding required.",
        image: `${base}products/placeholder3.jpg`,
        featuredRank: 3,
    },
    {
        id: "puzzle-keychain",
        name: "Puzzle Keychain",
        price: 6.99,
        category: "fidget",
        fulfillment: "ready",
        qty: 9,
        description: "Tiny brain teaser you can carry anywhere.",
        image: `${base}products/placeholder4.jpg`,
        featuredRank: 4,
    },
];
