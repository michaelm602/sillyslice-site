// src/hooks/useProducts.js
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { products as localProducts } from "../data/products";

/**
 * Fetch products from Firestore, but ALWAYS fallback to localProducts
 * so the site never white-screens if Firebase is misconfigured.
 */
export default function useProducts() {
    const [remoteProducts, setRemoteProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        async function run() {
            try {
                const snap = await getDocs(collection(db, "products"));
                const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

                if (alive) {
                    setRemoteProducts(items);
                    setError(null);
                }
            } catch (e) {
                if (alive) {
                    setRemoteProducts(null);
                    setError(e);
                }
            } finally {
                if (alive) setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, []);

    const products = useMemo(() => {
        // If Firestore returns empty (common early on), fallback to local data
        return Array.isArray(remoteProducts) && remoteProducts.length > 0
            ? remoteProducts
            : localProducts;
    }, [remoteProducts]);

    return {
        products,
        loading,
        usingRemote: Array.isArray(remoteProducts) && remoteProducts.length > 0,
        error,
    };
}
