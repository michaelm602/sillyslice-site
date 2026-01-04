// src/hooks/useFeaturedProducts.js
import { products } from "../data/products";

export function useFeaturedProducts(limit = 4) {
    return [...products]
        .filter((p) => Number.isFinite(p.featuredRank))
        .sort((a, b) => a.featuredRank - b.featuredRank)
        .slice(0, limit);
}
