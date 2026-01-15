// src/hooks/useAdminProducts.js
import { useCallback, useEffect, useState } from "react";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    serverTimestamp,
    deleteField,
} from "firebase/firestore";
import { db } from "../firebase";
import { PRODUCT_DEFAULTS } from "../data/products";
import { deleteDoc } from "firebase/firestore";

function makeNewId(prefix = "prod") {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export default function useAdminProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "products"));
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            // keep your current sort behavior
            list.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));
            setItems(list);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                if (!alive) return;
                await refresh();
            } catch (e) {
                if (!alive) return;
                setItems([]);
                setLoading(false);
                console.error("[Silly Slice] Failed to load products:", e);
            }
        })();

        return () => {
            alive = false;
        };
    }, [refresh]);

    async function seedFromLocal(localProducts) {
        const snap = await getDocs(collection(db, "products"));
        const existing = new Set(snap.docs.map((d) => d.id));

        const writes = (localProducts || [])
            .filter((p) => p?.id && !existing.has(p.id))
            .map((p) =>
                setDoc(doc(db, "products", p.id), {
                    ...p,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                })
            );

        await Promise.all(writes);
        await refresh();
    }

    async function saveDraft(productId, draftPatch) {
        // Merge patch into draft without overwriting other draft fields
        const patch = {};
        for (const [k, v] of Object.entries(draftPatch || {})) {
            patch[`draft.${k}`] = v;
        }

        await updateDoc(doc(db, "products", productId), {
            ...patch,
            updatedAt: serverTimestamp(),
        });

        await refresh();
    }

    async function publishDraft(productId) {
        const current = items.find((p) => p.id === productId);
        const draft = current?.draft;
        if (!draft) return;

        // promote draft fields to root, delete draft
        const patch = {
            ...draft,
            draft: deleteField(),
            updatedAt: serverTimestamp(),
        };

        // preserve your explicit path fields behavior
        if (draft.imagePath !== undefined) patch.imagePath = draft.imagePath;
        if (draft.galleryPaths !== undefined) patch.galleryPaths = draft.galleryPaths;

        await updateDoc(doc(db, "products", productId), patch);
        await refresh();
    }

    async function discardDraft(productId) {
        await updateDoc(doc(db, "products", productId), {
            draft: deleteField(),
            updatedAt: serverTimestamp(),
        });

        await refresh();
    }

    async function deleteProductDoc(productId) {
        await deleteDoc(doc(db, "products", productId));
        await refresh();
    }



    // ✅ NEW: create a draft-safe product (hidden by default)
    async function createProduct() {
        const id = makeNewId("prod");

        const base = {
            ...PRODUCT_DEFAULTS,
            id,
            name: "Untitled",
            price: 0,
            image: "",
            gallery: [],
            active: false, // IMPORTANT: starts hidden until ready
            featuredRank: null,

            // stock defaults (keeps it hidden by our visibility rules)
            qty: 0,
            leadDays: null,

            // storage path maps
            imagePath: null,
            galleryPaths: {},

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, "products", id), base, { merge: false });
        await refresh();
        return id;
    }

    // ✅ NEW: duplicate a product (copy current effective fields into new doc)
    // ✅ NEW: duplicate a product (copy details, reset media to force fresh uploads)
    async function duplicateProduct(sourceProduct) {
        if (!sourceProduct) throw new Error("No source product provided");

        const id = makeNewId("prod");

        const copy = {
            ...PRODUCT_DEFAULTS,

            id,
            name: sourceProduct.name ? `${sourceProduct.name} (Copy)` : "Untitled (Copy)",
            price: Number(sourceProduct.price) || 0,
            category: sourceProduct.category || "fidget",
            fulfillment: sourceProduct.fulfillment || "ready",
            leadDays: sourceProduct.leadDays ?? null,
            qty: sourceProduct.qty ?? null,
            description: sourceProduct.description || "",

            // ✅ reset media so we don’t clone broken placeholders or shared images
            image: "",
            gallery: [],
            imagePath: null,
            galleryPaths: {},

            // IMPORTANT: duplicate starts hidden
            active: false,
            featuredRank: null,

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, "products", id), copy, { merge: false });
        await refresh();
        return id;
    }


    return {
        items,
        loading,
        refresh,
        seedFromLocal,
        saveDraft,
        publishDraft,
        discardDraft,
        createProduct,
        duplicateProduct,
        deleteProductDoc, // ✅ NEW
    };
}
