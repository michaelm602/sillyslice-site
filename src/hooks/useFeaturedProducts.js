// src/hooks/useFeaturedProducts.js
import { useMemo } from "react";
import useProducts from "./useProducts";

export function useFeaturedProducts(limit = 4) {
    const { products, loading } = useProducts();

    const featured = useMemo(() => {
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

        const ranked = products
            .filter((p) => Number.isFinite(p.featuredRank))
            .sort((a, b) => a.featuredRank - b.featuredRank);

        if (ranked.length >= limit) return ranked.slice(0, limit);

        const fill = products
            .filter((p) => !Number.isFinite(p.featuredRank))
            .slice(0, limit - ranked.length);

        return [...ranked, ...fill];
    }, [products, limit]);

    return { featured, loading };
}
