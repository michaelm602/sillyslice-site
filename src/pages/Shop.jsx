import { useMemo, useState } from "react";
import useProducts from "../hooks/useProducts";
import { categories } from "../data/products";
import ToyCard from "../components/ToyCard";

export default function Shop() {
    const [cat, setCat] = useState("all");

    // ✅ use shopProducts for customer-facing list
    const { shopProducts, loading, source } = useProducts();

    const filtered = useMemo(() => {
        if (cat === "all") return shopProducts;
        return shopProducts.filter((p) => p.category === cat);
    }, [cat, shopProducts]);

    const categoryOptions = useMemo(() => {
        return [{ id: "all", name: "All" }, ...categories];
    }, []);

    const isDev = import.meta.env.DEV;
    const fallbackImg = `${import.meta.env.BASE_URL}products/placeholder1.png`;

    const subtitle = loading
        ? "Loading products…"
        : filtered.length
            ? "Fresh drops and made-to-order goodies."
            : "We’re loading up the shop. Check back soon.";

    return (
        <div className="shop-page">
            <div className="shop-top">
                <div>
                    <h1 className="shop-title">Shop</h1>
                    <p className="shop-subtitle">{subtitle}</p>
                </div>

                <div className="shop-filter">
                    <label className="shop-label" htmlFor="cat">
                        Category
                    </label>

                    <select
                        id="cat"
                        className="shop-select"
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        disabled={loading}
                    >
                        {categoryOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <section className="card-soft" style={{ padding: 18 }}>
                {loading ? null : filtered.length === 0 ? (
                    <div style={{ padding: 10, opacity: 0.85 }}>
                        <div style={{ fontWeight: 800, marginBottom: 6 }}>No products yet</div>
                        <div>We’re adding inventory right now. Swing back soon.</div>

                        {isDev && source === "local" ? (
                            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
                                DEV note: You’re seeing local fallback disabled in the shop list because we’re
                                showing only “published-ish” items (active + image). Seed Firestore and upload
                                real images to see them here.
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="toy-grid">
                        {filtered.map((p) => (
                            <ToyCard
                                key={p.id}
                                product={p}
                                to={`/shop/${p.id}`}
                                linkText="View →"
                                // ✅ only pass placeholder fallback in DEV (optional)
                                fallbackImg={isDev ? fallbackImg : undefined}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
