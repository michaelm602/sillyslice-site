export const categories = [
    { id: "fidget", name: "Fidgets" },
    { id: "sensory", name: "Sensory" },
    { id: "articulated", name: "Articulated" },
];

export const products = [
    {
        id: "gear-clicker",
        name: "Gear Clicker",
        price: 9.99,
        category: "fidget",
        fulfillment: "ready",
        qty: 12,
        description: "Clicky little gear toy. Loud enough to annoy your enemies.",
        image: "/products/placeholder1.png",
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
        image: "/products/placeholder2.webp",
    },
    {
        id: "mini-dragon",
        name: "Mini Articulated Dragon",
        price: 19.99,
        category: "articulated",
        fulfillment: "ready",
        qty: 5,
        description: "Flexy dragon friend. No feeding required.",
        image: "/products/placeholder3.jpg",
    },
];
