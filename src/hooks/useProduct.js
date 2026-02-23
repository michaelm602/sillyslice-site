// src/hooks/useProduct.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeProduct } from "./useProducts";

export default function useProduct(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setProduct(null);
            setError(null);
            setLoading(false);
            return;
        }

        let alive = true;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const snap = await getDoc(doc(db, "products", id));
                if (!alive) return;
                setProduct(snap.exists() ? normalizeProduct(snap.data(), snap.id) : null);
            } catch (e) {
                if (!alive) return;
                setError(e);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => { alive = false; };
    }, [id]);

    return { product, loading, error };
}
