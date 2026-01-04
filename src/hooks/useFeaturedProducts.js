// src/hooks/useFeaturedProducts.js
import { useMemo } from "react";
import { products } from "../data/products";

export function useFeaturedProducts(limit = 4) {
    return useMemo(() => {
        // 1) Ranked featured products
        const ranked = products
            .filter((p) => Number.isFinite(p.featuredRank))
            .sort((a, b) => a.featuredRank - b.featuredRank);

        // 2) Fallback: if not enough ranked items, fill from the rest
        if (ranked.length >= limit) return ranked.slice(0, limit);

        const fill = products
            .filter((p) => !Number.isFinite(p.featuredRank))
            .slice(0, limit - ranked.length);

        return [...ranked, ...fill];
    }, [limit]);
}
