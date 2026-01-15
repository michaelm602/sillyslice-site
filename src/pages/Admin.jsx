// src/pages/Admin.jsx
import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import useSiteContent from "../hooks/useSiteContent";
import useAdminProducts from "../hooks/useAdminProducts";
import { doc, setDoc } from "firebase/firestore";
import { localSiteContent } from "../data/siteContent";
import { products as localProducts, categories } from "../data/products";
import { useNavigate } from "react-router-dom";
import { uploadProductImage } from "../utils/uploadImage";
import { deleteStorageImage } from "../utils/deleteImage";
import { getProductVisibility } from "../utils/productVisibility";

const LS_KEY = "sillyslice_admin_ui";

function loadUiState() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveUiState(next) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
        // ignore
    }
}

function toNumberOrNull(v) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export default function Admin() {
    const navigate = useNavigate();

    // --- UI state persistence (tab / selected product / view) ---
    const ui = loadUiState();
    const [tab, setTab] = useState(ui?.tab || "site"); // "site" | "products"
    const [selectedId, setSelectedId] = useState(ui?.selectedId || "");
    const [view, setView] = useState(ui?.view || "draft"); // "draft" | "published"

    useEffect(() => {
        saveUiState({ tab, selectedId, view });
    }, [tab, selectedId, view]);

    // Site content
    const { content, usingRemote, loading, error } = useSiteContent();

    // Products admin
    const {
        items: products,
        loading: productsLoading,
        seedFromLocal,
        saveDraft,
        publishDraft,
        discardDraft,
        deleteProductDoc,
        refresh,
        createProduct,
        duplicateProduct,
    } = useAdminProducts();

    // If stored selectedId doesn’t exist anymore, clear it
    useEffect(() => {
        if (!selectedId) return;
        const exists = products.some((p) => p.id === selectedId);
        if (!exists) setSelectedId("");
    }, [products, selectedId]);

    const selected = useMemo(
        () => products.find((p) => p.id === selectedId) || null,
        [products, selectedId]
    );

    const isDev = import.meta.env.DEV;

    // Draft editor view model
    const editor = useMemo(() => {
        if (!selected) return null;

        const base = {
            name: selected.name ?? "",
            price: selected.price ?? 0,
            category: selected.category ?? "fidget",
            fulfillment: selected.fulfillment ?? "ready",
            qty: selected.qty ?? null,
            leadDays: selected.leadDays ?? null,
            description: selected.description ?? "",
            featuredRank: selected.featuredRank ?? null,
            active: selected.active ?? true,
            image: (selected.image ?? "").trim(),
            gallery: Array.isArray(selected.gallery) ? selected.gallery.filter(Boolean) : [],

            // storage path tracking (for delete reliability)
            imagePath: selected.imagePath ?? null,
            galleryPaths:
                selected.galleryPaths && typeof selected.galleryPaths === "object"
                    ? selected.galleryPaths
                    : {},
        };

        const draft =
            selected.draft && typeof selected.draft === "object" ? selected.draft : null;

        const merged = view === "draft" && draft ? { ...base, ...draft } : base;

        // normalize AFTER merge so draft can't nuke it
        const g = Array.isArray(merged.gallery) ? merged.gallery.filter(Boolean) : [];
        const legacyMain = (merged.image ?? "").trim();
        const hero = (g[0] || legacyMain).trim();
        const normalizedGallery = hero ? [hero, ...g.filter((u) => u !== hero)] : g;

        // paths: take from merged (draft overrides base when view=draft)
        const mergedGalleryPaths =
            merged.galleryPaths && typeof merged.galleryPaths === "object"
                ? merged.galleryPaths
                : {};

        const nextImagePath = hero
            ? (mergedGalleryPaths[hero] || merged.imagePath || null)
            : null;

        return {
            ...merged,
            image: hero,
            gallery: normalizedGallery,
            galleryPaths: mergedGalleryPaths,
            imagePath: nextImagePath,
        };
    }, [selected, view]);

    const [form, setForm] = useState(null);

    // Keep form synced to selection/view changes
    useEffect(() => {
        setForm(editor);
    }, [editor]);

    const [dragIndex, setDragIndex] = useState(null);

    function moveItem(arr, from, to) {
        const next = arr.slice();
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
    }

    function uniq(arr) {
        return Array.from(new Set((arr || []).filter(Boolean)));
    }

    function collectAllImagePaths(product) {
        if (!product) return [];

        const paths = [];

        // published
        if (product.imagePath) paths.push(product.imagePath);
        if (product.galleryPaths && typeof product.galleryPaths === "object") {
            paths.push(...Object.values(product.galleryPaths));
        }

        // draft
        const d = product.draft;
        if (d && typeof d === "object") {
            if (d.imagePath) paths.push(d.imagePath);
            if (d.galleryPaths && typeof d.galleryPaths === "object") {
                paths.push(...Object.values(d.galleryPaths));
            }
        }

        return uniq(paths);
    }


    // ✅ FIXED: no using vars before they exist
    async function applyGalleryOrder(nextGallery) {
        if (!selected) return;

        const cleaned = Array.isArray(nextGallery) ? nextGallery.filter(Boolean) : [];
        const hero = (cleaned[0] || "").trim();

        const galleryPaths =
            (selected?.draft &&
                typeof selected.draft.galleryPaths === "object" &&
                selected.draft.galleryPaths) ||
            (form?.galleryPaths && typeof form.galleryPaths === "object"
                ? form.galleryPaths
                : {}) ||
            {};

        const nextImagePath = hero ? (galleryPaths[hero] || form?.imagePath || null) : null;

        const next = {
            ...(form || {}),
            gallery: cleaned,
            image: hero,
            galleryPaths,
            imagePath: nextImagePath,
        };

        setForm(next);

        await saveDraft(selected.id, {
            ...(selected.draft || {}),
            gallery: cleaned,
            image: hero,
            galleryPaths,
            imagePath: nextImagePath,
        });
    }

    async function seedSiteContent() {
        await setDoc(doc(db, "siteContent", "main"), localSiteContent, { merge: false });
        alert("Seeded Firestore: siteContent/main");
    }

    async function pushCurrentToFirestore() {
        await setDoc(doc(db, "siteContent", "main"), content, { merge: false });
        alert("Overwrote Firestore with current content");
    }

    async function onSeedProducts() {
        await seedFromLocal(localProducts);
        alert("Seeded missing products to Firestore");
    }

    async function onSaveDraft() {
        if (!selected || !form) return;

        const gallery = Array.isArray(form.gallery) ? form.gallery.filter(Boolean) : [];
        const hero = (gallery[0] || form.image || "").trim();
        const finalGallery = hero ? [hero, ...gallery.filter((u) => u !== hero)] : gallery;

        await saveDraft(selected.id, {
            name: form.name,
            price: Number(form.price) || 0,
            category: form.category,
            fulfillment: form.fulfillment,
            qty: form.fulfillment === "ready" ? toNumberOrNull(form.qty) : null,
            leadDays: form.fulfillment === "made" ? toNumberOrNull(form.leadDays) : null,
            description: form.description,
            featuredRank: toNumberOrNull(form.featuredRank),
            active: !!form.active,

            // keep hero synced with gallery[0]
            image: hero,
            gallery: finalGallery,

            // keep path maps if present
            imagePath: form.imagePath ?? null,
            galleryPaths:
                form.galleryPaths && typeof form.galleryPaths === "object" ? form.galleryPaths : {},
        });

        alert("Saved draft");
        await refresh();
    }

    async function onPublish() {
        if (!selected) return;
        await publishDraft(selected.id);
        alert("Published draft");
        await refresh();
    }

    async function onUploadMainImage(file) {
        if (!selected || !file) return;

        const { url, path } = await uploadProductImage({
            file,
            productId: selected.id,
            kind: "main",
        });

        const currentGallery = Array.isArray(form?.gallery) ? form.gallery.filter(Boolean) : [];
        const nextGallery = [url, ...currentGallery.filter((u) => u !== url)];

        const currentPaths =
            (selected?.draft && typeof selected.draft.galleryPaths === "object" && selected.draft.galleryPaths) ||
            (form?.galleryPaths && typeof form.galleryPaths === "object" ? form.galleryPaths : {}) ||
            {};

        const nextGalleryPaths = { ...currentPaths, [url]: path };

        const next = {
            ...(form || {}),
            image: url,
            gallery: nextGallery,
            imagePath: path,
            galleryPaths: nextGalleryPaths,
        };
        setForm(next);

        await saveDraft(selected.id, {
            ...(selected.draft || {}),
            image: url,
            gallery: nextGallery,
            imagePath: path,
            galleryPaths: nextGalleryPaths,
        });

        await refresh();
    }

    async function onUploadGalleryImages(fileList) {
        if (!selected || !fileList || fileList.length === 0) return;

        const files = Array.from(fileList);

        const uploaded = await Promise.all(
            files.map((file) => uploadProductImage({ file, productId: selected.id, kind: "gallery" }))
        );

        const newUrls = uploaded.map((u) => u.url);

        const currentGallery = Array.isArray(form?.gallery) ? form.gallery.filter(Boolean) : [];
        const merged = [...currentGallery, ...newUrls];

        // de-dupe keep order
        const seen = new Set();
        const nextGallery = merged.filter((u) => u && !seen.has(u) && seen.add(u));

        const hero = nextGallery[0] || form.image || "";

        const currentPaths =
            (selected?.draft && typeof selected.draft.galleryPaths === "object" && selected.draft.galleryPaths) ||
            (form?.galleryPaths && typeof form.galleryPaths === "object" ? form.galleryPaths : {}) ||
            {};

        const nextGalleryPaths = { ...currentPaths };
        for (const { url, path } of uploaded) {
            nextGalleryPaths[url] = path;
        }

        const nextImagePath =
            hero === form.image ? (form.imagePath || null) : (nextGalleryPaths[hero] || form.imagePath || null);

        const next = {
            ...(form || {}),
            gallery: nextGallery,
            image: hero,
            galleryPaths: nextGalleryPaths,
            imagePath: nextImagePath,
        };
        setForm(next);

        await saveDraft(selected.id, {
            ...(selected.draft || {}),
            gallery: nextGallery,
            image: hero,
            galleryPaths: nextGalleryPaths,
            imagePath: nextImagePath,
        });

        await refresh();
    }

    async function onDeleteImageUrl(url) {
        if (!selected || !form) return;

        const ok = window.confirm("Delete this image forever? No undo.");
        if (!ok) return;

        const galleryPaths =
            (selected?.draft && typeof selected.draft.galleryPaths === "object" && selected.draft.galleryPaths) ||
            (form?.galleryPaths && typeof form.galleryPaths === "object" ? form.galleryPaths : {}) ||
            {};

        const path = galleryPaths[url] || (form.image === url ? form.imagePath : null);

        // Remove from gallery
        const nextGallery = (form.gallery || []).filter((u) => u !== url);

        // If we deleted the hero, promote next image
        const nextHero = nextGallery[0] || "";

        // update map
        const nextGalleryPaths = { ...galleryPaths };
        delete nextGalleryPaths[url];

        const nextImagePath = nextHero ? (nextGalleryPaths[nextHero] || null) : null;

        // optimistic UI update
        setForm({
            ...form,
            gallery: nextGallery,
            image: nextHero,
            galleryPaths: nextGalleryPaths,
            imagePath: nextImagePath,
        });

        try {
            // 1) delete from Storage
            await deleteStorageImage({ path, url });

            // 2) save draft changes
            await saveDraft(selected.id, {
                ...(selected.draft || {}),
                gallery: nextGallery,
                image: nextHero,
                galleryPaths: nextGalleryPaths,
                imagePath: nextImagePath,
            });

            await refresh();
        } catch (err) {
            console.error(err);
            alert(err.message || "Delete failed");
            await refresh();
        }
    }

    return (
        <div className="card" style={{ padding: 24, display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ margin: 0 }}>Admin</h1>
                    <div style={{ opacity: 0.8, marginTop: 6 }}>
                        Status:{" "}
                        <strong>
                            {loading ? "Loading…" : usingRemote ? "Connected to Firestore" : "Using local fallback"}
                        </strong>
                    </div>
                    {error ? <div style={{ color: "salmon", marginTop: 6 }}>{error}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <button className={`btn ${tab === "site" ? "btn-primary" : ""}`} onClick={() => setTab("site")}>
                        Site Content
                    </button>
                    <button className={`btn ${tab === "products" ? "btn-primary" : ""}`} onClick={() => setTab("products")}>
                        Products
                    </button>

                    <button
                        className="btn"
                        onClick={async () => {
                            await signOut(auth);
                            navigate("/", { replace: true });
                        }}
                    >
                        Log out
                    </button>
                </div>
            </div>

            {/* ---------------- SITE CONTENT TAB ---------------- */}
            {tab === "site" ? (
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button className="btn" onClick={seedSiteContent}>
                            Seed Firestore from local defaults
                        </button>

                        <button className="btn" onClick={pushCurrentToFirestore} title="Optional">
                            Overwrite Firestore with current content
                        </button>
                    </div>

                    <pre style={{ marginTop: 8, fontSize: 13, overflow: "auto" }}>
                        {JSON.stringify(content, null, 2)}
                    </pre>
                </div>
            ) : null}

            {/* ---------------- PRODUCTS TAB ---------------- */}
            {tab === "products" ? (
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        <button className="btn" onClick={onSeedProducts}>
                            Seed Products (missing only)
                        </button>

                        <button
                            className="btn"
                            onClick={refresh}
                            disabled={productsLoading}
                        >
                            {productsLoading ? "Refreshing…" : "Refresh"}
                        </button>

                        {/* ✅ NEW PRODUCT */}
                        <button
                            className="btn btn-primary"
                            onClick={async () => {
                                const id = await createProduct();
                                setSelectedId(id);
                                setView("draft");
                            }}
                            disabled={productsLoading}
                        >
                            + New Product
                        </button>

                        {/* ✅ DUPLICATE */}
                        <button
                            className="btn"
                            onClick={async () => {
                                if (!selected || !form) return;

                                const source = view === "draft" ? form : selected;
                                const newId = await duplicateProduct(source);

                                setSelectedId(newId);
                                setView("draft");
                            }}
                            disabled={!selected || !form || productsLoading}
                        >
                            Duplicate
                        </button>

                        <div style={{ opacity: 0.8 }}>
                            {productsLoading ? "Loading products…" : `${products.length} products`}
                            {!isDev ? " (PROD mode)" : " (DEV mode)"}
                        </div>
                    </div>


                    <div className="admin-shell">
                        {/* Left list */}
                        <div className="card-soft admin-list">
                            <div style={{ fontWeight: 900, marginBottom: 10 }}>Products</div>

                            <div style={{ display: "grid", gap: 8 }}>
                                {products.map((p) => {
                                    const isSelected = p.id === selectedId;

                                    const source =
                                        p.draft && typeof p.draft === "object" ? { ...p, ...p.draft } : p;

                                    const vis = getProductVisibility(source);

                                    return (
                                        <button
                                            key={p.id}
                                            className="btn"
                                            onClick={() => {
                                                setSelectedId(p.id);
                                                setView("draft");
                                            }}
                                            style={{
                                                textAlign: "left",
                                                border: isSelected ? "1px solid rgba(255,255,255,0.4)" : undefined,
                                                opacity: source.active !== false ? 1 : 0.6,
                                                display: "grid",
                                                gap: 2,
                                            }}
                                            title={p.id}
                                        >
                                            <div style={{ fontWeight: 800 }}>{source.name || p.id}</div>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                                {source.category || "—"} •{" "}
                                                {vis.visible ? "VISIBLE ✅" : `HIDDEN ⚠️ (${vis.issues[0]})`} •{" "}
                                                {source.active !== false ? "active" : "inactive"}
                                                {p.draft ? " • draft ✍️" : ""}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right editor */}
                        <div className="card-soft admin-editor">
                            {!selected ? (
                                <div style={{ opacity: 0.8 }}>
                                    Pick a product on the left to edit. Upload an image + publish to make it show in the Shop.
                                </div>
                            ) : !form ? (
                                <div style={{ opacity: 0.8 }}>Loading editor…</div>
                            ) : (
                                <div style={{ display: "grid", gap: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                        <div>
                                            <div style={{ fontWeight: 900, fontSize: 18 }}>{selected.name || selected.id}</div>
                                            <div style={{ fontSize: 12, opacity: 0.75 }}>{selected.id}</div>
                                        </div>

                                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                            <button
                                                className={`btn ${view === "draft" ? "btn-primary" : ""}`}
                                                onClick={() => setView("draft")}
                                            >
                                                Draft
                                            </button>
                                            <button
                                                className={`btn ${view === "published" ? "btn-primary" : ""}`}
                                                onClick={() => setView("published")}
                                            >
                                                Published
                                            </button>
                                        </div>
                                    </div>

                                    {/* ✅ Shop visibility checklist */}
                                    {(() => {
                                        const vis = getProductVisibility(form);
                                        return (
                                            <div className="card-soft" style={{ padding: 12, borderRadius: 14 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                                                    <div style={{ fontWeight: 900 }}>Shop Visibility</div>
                                                    <div style={{ fontWeight: 900 }}>{vis.visible ? "VISIBLE ✅" : "HIDDEN ⚠️"}</div>
                                                </div>

                                                {vis.visible ? (
                                                    <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                                                        Meets requirements to show in Shop.
                                                    </div>
                                                ) : (
                                                    <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, fontSize: 13, opacity: 0.85 }}>
                                                        {vis.issues.map((x) => (
                                                            <li key={x}>{x}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Main image upload */}
                                    <div style={{ display: "grid", gap: 8 }}>
                                        <div style={{ fontWeight: 800 }}>Main image</div>

                                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) onUploadMainImage(file);
                                                    e.target.value = "";
                                                }}
                                            />
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                                Upload saves to <strong>draft</strong>. Publish when it looks right.
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => onDeleteImageUrl(form.image)}
                                                disabled={!form.image}
                                                style={{ border: "1px solid rgba(255,80,120,0.6)" }}
                                            >
                                                Delete main image
                                            </button>
                                        </div>

                                        {form.image ? (
                                            <img
                                                src={form.image}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 520,
                                                    height: 280,
                                                    objectFit: "contain",
                                                    background: "rgba(0,0,0,0.25)",
                                                    borderRadius: 14,
                                                    border: "1px solid rgba(255,255,255,0.14)",
                                                }}
                                            />
                                        ) : (
                                            <div style={{ opacity: 0.7 }}>No image yet.</div>
                                        )}
                                    </div>

                                    {/* Gallery images */}
                                    <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
                                        <div style={{ fontWeight: 800 }}>Gallery images</div>

                                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (files.length) onUploadGalleryImages(files);
                                                    e.target.value = "";
                                                }}
                                            />
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                                Multi-upload saves to <strong>draft</strong>. Publish when ready.
                                            </div>
                                        </div>

                                        {form.gallery?.length ? (
                                            <div className="admin-galleryGrid">
                                                {form.gallery.map((url, i) => {
                                                    const isHero = i === 0;

                                                    return (
                                                        <div
                                                            key={url}
                                                            draggable
                                                            onDragStart={() => setDragIndex(i)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={async () => {
                                                                if (dragIndex === null || dragIndex === i) return;
                                                                const nextGallery = moveItem(form.gallery, dragIndex, i);
                                                                setDragIndex(null);
                                                                await applyGalleryOrder(nextGallery);
                                                            }}
                                                            title={isHero ? "Hero image (first)" : "Drag to reorder"}
                                                            style={{
                                                                width: 120,
                                                                display: "grid",
                                                                gap: 6,
                                                                cursor: "grab",
                                                                userSelect: "none",
                                                            }}
                                                        >
                                                            <img
                                                                src={url}
                                                                alt=""
                                                                style={{
                                                                    width: 120,
                                                                    height: 120,
                                                                    objectFit: "cover",
                                                                    borderRadius: 10,
                                                                    border: isHero
                                                                        ? "2px solid rgba(57,214,255,0.8)"
                                                                        : "1px solid rgba(255,255,255,0.14)",
                                                                }}
                                                            />

                                                            <button
                                                                className="btn"
                                                                type="button"
                                                                onClick={async () => {
                                                                    const nextGallery = [url, ...form.gallery.filter((u) => u !== url)];
                                                                    await applyGalleryOrder(nextGallery);
                                                                }}
                                                                style={{ padding: "6px 8px", fontSize: 12, borderRadius: 10 }}
                                                            >
                                                                Make hero
                                                            </button>

                                                            <button
                                                                className="btn"
                                                                type="button"
                                                                onClick={() => onDeleteImageUrl(url)}
                                                                style={{
                                                                    padding: "6px 8px",
                                                                    fontSize: 12,
                                                                    borderRadius: 10,
                                                                    border: "1px solid rgba(255,80,120,0.6)",
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div style={{ opacity: 0.7 }}>No gallery images yet.</div>
                                        )}
                                    </div>

                                    {/* Form fields */}
                                    <div style={{ display: "grid", gap: 10 }}>
                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Name</span>
                                            <input
                                                className="shop-select"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            />
                                        </label>

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Price</span>
                                            <input
                                                className="shop-select"
                                                type="number"
                                                step="0.01"
                                                value={form.price}
                                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            />
                                        </label>

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Category</span>
                                            <select
                                                className="shop-select"
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            >
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Fulfillment</span>
                                            <select
                                                className="shop-select"
                                                value={form.fulfillment}
                                                onChange={(e) => setForm({ ...form, fulfillment: e.target.value })}
                                            >
                                                <option value="ready">Ready-to-ship</option>
                                                <option value="made">Made-to-order</option>
                                            </select>
                                        </label>

                                        {form.fulfillment === "ready" ? (
                                            <label style={{ display: "grid", gap: 6 }}>
                                                <span style={{ fontWeight: 800 }}>Qty (in stock)</span>
                                                <input
                                                    className="shop-select"
                                                    type="number"
                                                    value={form.qty ?? ""}
                                                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                                                />
                                            </label>
                                        ) : (
                                            <label style={{ display: "grid", gap: 6 }}>
                                                <span style={{ fontWeight: 800 }}>Lead days</span>
                                                <input
                                                    className="shop-select"
                                                    type="number"
                                                    value={form.leadDays ?? ""}
                                                    onChange={(e) => setForm({ ...form, leadDays: e.target.value })}
                                                />
                                            </label>
                                        )}

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Featured rank (optional)</span>
                                            <input
                                                className="shop-select"
                                                type="number"
                                                value={form.featuredRank ?? ""}
                                                onChange={(e) => setForm({ ...form, featuredRank: e.target.value })}
                                            />
                                        </label>

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Active</span>
                                            <input
                                                type="checkbox"
                                                checked={!!form.active}
                                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                            />
                                        </label>

                                        <label style={{ display: "grid", gap: 6 }}>
                                            <span style={{ fontWeight: 800 }}>Description</span>
                                            <textarea
                                                className="shop-select"
                                                rows={5}
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            />
                                        </label>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                                        <button className="btn btn-primary" onClick={onSaveDraft}>
                                            Save draft
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={async () => {
                                                if (!selected?.id) return;

                                                const ok = window.confirm("Discard draft changes and revert to published? No undo.");
                                                if (!ok) return;

                                                await discardDraft(selected.id);

                                                // after discard, keep UI aligned
                                                setView("published");
                                            }}
                                            disabled={!selected?.draft}
                                            title={!selected?.draft ? "No draft to discard" : "Throw away draft changes"}
                                        >
                                            Discard draft
                                        </button>


                                        {/* ✅ Publish guarded by visibility */}
                                        {(() => {
                                            const draftSource =
                                                selected?.draft && typeof selected.draft === "object"
                                                    ? { ...selected, ...selected.draft }
                                                    : null;

                                            const draftVis = draftSource ? getProductVisibility(draftSource) : null;

                                            const disabled = !selected?.draft || !(draftVis && draftVis.visible);

                                            const title = !selected?.draft
                                                ? "No draft to publish"
                                                : !draftVis?.visible
                                                    ? "Fix shop visibility issues before publishing"
                                                    : "Publish draft";

                                            return (
                                                <button className="btn" onClick={onPublish} disabled={disabled} title={title}>
                                                    Publish draft
                                                </button>
                                            );
                                        })()}

                                        <button
                                            className="btn"
                                            onClick={async () => {
                                                if (!selected) return;

                                                const name = selected.name || selected.id;

                                                const ok = window.prompt(
                                                    `Type DELETE to permanently remove "${name}" (product + images).`,
                                                    ""
                                                );

                                                if (ok !== "DELETE") return;

                                                try {
                                                    // 1) delete all known storage images
                                                    const paths = collectAllImagePaths(selected);
                                                    for (const path of paths) {
                                                        await deleteStorageImage({ path });
                                                    }

                                                    // 2) delete firestore doc
                                                    await deleteProductDoc(selected.id);

                                                    // 3) reset UI
                                                    setSelectedId("");
                                                    setView("draft");

                                                    alert("Product deleted.");
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(err.message || "Delete failed");
                                                    await refresh();
                                                }
                                            }}
                                            style={{ border: "1px solid rgba(255,80,120,0.6)" }}
                                            title="Permanent delete (no undo)"
                                        >
                                            Delete product
                                        </button>


                                        {selected?.draft ? (
                                            <div style={{ fontSize: 12, opacity: 0.8, alignSelf: "center" }}>
                                                Draft exists ✅ Publish when ready.
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: 12, opacity: 0.7, alignSelf: "center" }}>
                                                No draft yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
