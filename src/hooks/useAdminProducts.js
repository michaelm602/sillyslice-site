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

export default function useAdminProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "products"));
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

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
                // optional: you can add an error state if you want
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

        // Only promote these if they exist in draft, otherwise keep published as-is.
        const patch = {
            ...draft,
            draft: deleteField(),
            updatedAt: serverTimestamp(),
        };

        if (draft.imagePath !== undefined) patch.imagePath = draft.imagePath;
        if (draft.galleryPaths !== undefined) patch.galleryPaths = draft.galleryPaths;

        await updateDoc(doc(db, "products", productId), patch);

        await refresh();
    }


    return { items, loading, refresh, seedFromLocal, saveDraft, publishDraft };
}
