import { useMemo, useState } from "react";
import { categories, products } from "../data/products";

function formatMoney(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function stockLabel(p) {
    if (p.fulfillment === "made") return `Made to order • ~${p.leadDays ?? 3} days`;
    if (typeof p.qty === "number" && p.qty > 0) return `In stock: ${p.qty}`;
    return "Sold out";
}

export default function Shop() {
    const [cat, setCat] = useState("all");

    const filtered = useMemo(() => {
        if (cat === "all") return products;
        return products.filter((p) => p.category === cat);
    }, [cat]);

    return (
        <div className="shop-page">
            <div className="shop-top">
                <div>
                    <h1 className="shop-title">Shop</h1>
                    <p className="shop-subtitle">
                        Placeholder products for now. Audrey will upload real ones from admin later.
                    </p>
                </div>

                <div className="shop-filter">
                    <label className="shop-label">Category</label>
                    <select value={cat} onChange={(e) => setCat(e.target.value)} className="shop-select">
                        <option value="all">All</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="product-grid">
                {filtered.map((p) => {
                    const isSoldOut = p.fulfillment === "ready" && (!p.qty || p.qty <= 0);

                    return (
                        <article key={p.id} className="product-card">
                            <div className="product-image">No image yet</div>

                            <div className="product-row">
                                <strong>{p.name}</strong>
                                <strong>{formatMoney(p.price)}</strong>
                            </div>

                            <p className="product-desc">{p.description}</p>

                            <div className="product-meta">
                                <span className="product-stock">{stockLabel(p)}</span>
                                <span className={`product-badge ${p.fulfillment === "ready" ? "ready" : "mto"}`}>
                                    {p.fulfillment === "ready" ? "Ready-to-ship" : "Made-to-order"}
                                </span>
                            </div>

                            <button
                                disabled={isSoldOut}
                                className={`btn ${isSoldOut ? "btn-disabled" : "btn-primary"} product-cta`}
                                onClick={() => alert("Checkout later. For now this is a placeholder.")}
                            >
                                {isSoldOut ? "Sold out" : "Add to cart (later)"}
                            </button>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
