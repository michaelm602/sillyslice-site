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
        refresh,
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
        };

        const draft =
            selected.draft && typeof selected.draft === "object" ? selected.draft : null;

        const merged = view === "draft" && draft ? { ...base, ...draft } : base;

        // ✅ normalize AFTER merge so draft can't nuke it
        const g = Array.isArray(merged.gallery) ? merged.gallery.filter(Boolean) : [];
        const legacyMain = (merged.image ?? "").trim();
        const hero = (g[0] || legacyMain).trim();
        const normalizedGallery = hero ? [hero, ...g.filter((u) => u !== hero)] : g;

        return {
            ...merged,
            image: hero,
            gallery: normalizedGallery,
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


    async function applyGalleryOrder(nextGallery) {
        if (!selected) return;

        const cleaned = Array.isArray(nextGallery) ? nextGallery.filter(Boolean) : [];
        const hero = (cleaned[0] || "").trim();

        const next = { ...(form || {}), gallery: cleaned, image: hero };
        setForm(next);

        // Save immediately so order sticks
        await saveDraft(selected.id, {
            ...(selected.draft || {}),
            gallery: cleaned,
            image: hero,
        });

        await refresh();
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
        const finalGallery = hero ? [hero, ...gallery.filter(u => u !== hero)] : gallery;


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
        });

        alert("Saved draft");
        await refresh();
    }

    async function onPublish() {
        if (!selected) return;
        await publishDraft(selected.id);
        alert("Published draft");
    }

    async function onUploadMainImage(file) {
        if (!selected || !file) return;

        const { url } = await uploadProductImage({ file, productId: selected.id, kind: "main" });

        const currentGallery = Array.isArray(form?.gallery) ? form.gallery.filter(Boolean) : [];
        const nextGallery = [url, ...currentGallery.filter((u) => u !== url)];

        const next = { ...(form || {}), image: url, gallery: nextGallery };
        setForm(next);

        await saveDraft(selected.id, { ...(selected.draft || {}), image: url, gallery: nextGallery });
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

        const next = { ...(form || {}), gallery: nextGallery, image: hero };
        setForm(next);

        await saveDraft(selected.id, { ...(selected.draft || {}), gallery: nextGallery, image: hero });
        await refresh();
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

                        <button className="btn" onClick={refresh} disabled={productsLoading}>
                            {productsLoading ? "Refreshing…" : "Refresh"}
                        </button>

                        <div style={{ opacity: 0.8 }}>
                            {productsLoading ? "Loading products…" : `${products.length} products`}
                            {!isDev ? " (PROD mode)" : " (DEV mode)"}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gap: 12,
                            gridTemplateColumns: "300px 1fr",
                            alignItems: "start",
                        }}
                    >
                        {/* Left list */}
                        <div className="card-soft" style={{ padding: 12 }}>
                            <div style={{ fontWeight: 900, marginBottom: 10 }}>Products</div>

                            <div style={{ display: "grid", gap: 8 }}>
                                {products.map((p) => {
                                    const isSelected = p.id === selectedId;

                                    const source =
                                        p.draft && typeof p.draft === "object" ? { ...p, ...p.draft } : p;

                                    const hero =
                                        source.image || (Array.isArray(source.gallery) ? source.gallery[0] : "") || "";

                                    const hasImage = typeof hero === "string" && hero.trim() !== "";
                                    const isActive = source.active !== false;

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
                                                opacity: isActive ? 1 : 0.6,
                                                display: "grid",
                                                gap: 2,
                                            }}
                                            title={p.id}
                                        >
                                            <div style={{ fontWeight: 800 }}>{source.name || p.id}</div>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                                {source.category || "—"} • {hasImage ? "image ✅" : "no image ⚠️"} •{" "}
                                                {isActive ? "active" : "inactive"}
                                                {p.draft ? " • draft ✍️" : ""}
                                            </div>
                                        </button>
                                    );
                                })}

                            </div>
                        </div>

                        {/* Right editor */}
                        <div className="card-soft" style={{ padding: 16 }}>
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
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 120px)", gap: 10 }}>
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
                                                                style={{
                                                                    padding: "6px 8px",
                                                                    fontSize: 12,
                                                                    borderRadius: 10,
                                                                }}
                                                            >
                                                                Make hero
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

                                        <button className="btn" onClick={onPublish} disabled={!selected?.draft}>
                                            Publish draft
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

                                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                                        Shop visibility rule: <strong>active + image</strong>. Upload + publish to make it show.
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
