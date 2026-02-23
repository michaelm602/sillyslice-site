// src/hooks/useProducts.js
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { products as localProducts, PRODUCT_DEFAULTS } from "../data/products";

const ALLOW_LOCAL_FALLBACK = import.meta.env.DEV;

// Deep merge rules:
// - objects merge recursively
// - arrays overwrite (no franken-arrays)
function deepMerge(base, override) {
    if (Array.isArray(base) || Array.isArray(override)) return override ?? base;

    const baseIsObj = base && typeof base === "object";
    const overIsObj = override && typeof override === "object";

    if (baseIsObj && overIsObj) {
        const out = { ...base };
        for (const k of Object.keys(override)) {
            out[k] = deepMerge(base[k], override[k]);
        }
        return out;
    }

    return override ?? base;
}

export function normalizeProduct(raw, fallbackId = "") {
    const safe = deepMerge(PRODUCT_DEFAULTS, raw || {});
    safe.id = safe.id || fallbackId;

    // normalize a couple gotchas
    if (!Number.isFinite(safe.price)) safe.price = 0;
    if (safe.qty === undefined) safe.qty = null;
    if (safe.leadDays === undefined) safe.leadDays = null;
    if (safe.featuredRank === undefined) safe.featuredRank = null;
    if (safe.active === undefined) safe.active = true;

    return safe;
}

export default function useProducts() {
    const [products, setProducts] = useState(() =>
        (localProducts || []).map((p) => normalizeProduct(p, p.id))
    );
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState(ALLOW_LOCAL_FALLBACK ? "local" : "firestore");
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const snap = await getDocs(collection(db, "products"));
                const docs = snap.docs.map((d) => normalizeProduct(d.data(), d.id));

                if (!alive) return;

                // Firestore has nothing:
                // - DEV: fall back to local placeholders
                // - PROD: show empty (no placeholders)
                if (!docs.length) {
                    if (ALLOW_LOCAL_FALLBACK) {
                        setProducts((localProducts || []).map((p) => normalizeProduct(p, p.id)));
                        setSource("local");
                    } else {
                        setProducts([]);
                        setSource("firestore");
                    }
                    return;
                }

                setProducts(docs);
                setSource("firestore");
            } catch (e) {
                if (!alive) return;

                setError(e);

                // Firestore failed:
                // - DEV: local fallback so you can keep building
                // - PROD: empty so placeholders never leak
                if (ALLOW_LOCAL_FALLBACK) {
                    setProducts((localProducts || []).map((p) => normalizeProduct(p, p.id)));
                    setSource("local");
                } else {
                    setProducts([]);
                    setSource("firestore");
                }
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();

        return () => {
            alive = false;
        };
    }, []);

    // What the Shop should show (published-ish rules)
    // - active must be true
    // - must have a real image URL (not empty)
    const shopProducts = useMemo(() => {
        return (products || []).filter((p) => {
            if (!p?.active) return false;
            if (!p?.image || typeof p.image !== "string" || p.image.trim() === "") return false;
            return true;
        });
    }, [products]);

    const byId = useMemo(() => {
        const map = new Map();
        for (const p of products) map.set(p.id, p);
        return map;
    }, [products]);

    return { products, shopProducts, byId, loading, source, error };
}
