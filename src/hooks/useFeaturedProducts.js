// src/hooks/useFeaturedProducts.js
import { useMemo } from "react";
import { products } from "../data/products";

export function useFeaturedProducts(limit = 4) {
    return useMemo(() => {
        // DEV-ONLY: warn on duplicate featuredRank
        if (import.meta.env.DEV) {
            const seen = new Map();

            products.forEach((p) => {
                if (Number.isFinite(p.featuredRank)) {
                    if (seen.has(p.featuredRank)) {
                        console.warn(
                            `[Silly Slice] Duplicate featuredRank detected → ${p.featuredRank}`,
                            {
                                productA: seen.get(p.featuredRank),
                                productB: p,
                            }
                        );
                    } else {
                        seen.set(p.featuredRank, p);
                    }
                }
            });
        }

        // 1) Ranked featured products
        const ranked = products
            .filter((p) => Number.isFinite(p.featuredRank))
            .sort((a, b) => a.featuredRank - b.featuredRank);

        // 2) Fallback: auto-fill if not enough ranked
        if (ranked.length >= limit) return ranked.slice(0, limit);

        const fill = products
            .filter((p) => !Number.isFinite(p.featuredRank))
            .slice(0, limit - ranked.length);

        return [...ranked, ...fill];
    }, [limit]);
}
