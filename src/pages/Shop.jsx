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
        <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ margin: 0 }}>Shop</h1>
                    <p style={{ marginTop: 6, color: "rgba(0,0,0,0.7)" }}>
                        Placeholder products for now. Audrey will upload real ones from admin later.
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{ fontWeight: 700 }}>Category</label>
                    <select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.18)" }}
                    >
                        <option value="all">All</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {filtered.map((p) => {
                    const isSoldOut = p.fulfillment === "ready" && (!p.qty || p.qty <= 0);

                    return (
                        <article
                            key={p.id}
                            style={{
                                borderRadius: 18,
                                border: "1px solid rgba(0,0,0,0.08)",
                                padding: 16,
                                display: "grid",
                                gap: 10,
                                background: "white",
                            }}
                        >
                            <div
                                style={{
                                    height: 140,
                                    borderRadius: 14,
                                    border: "1px dashed rgba(0,0,0,0.25)",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "rgba(0,0,0,0.55)",
                                    fontWeight: 700,
                                }}
                            >
                                No image yet
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                <strong>{p.name}</strong>
                                <strong>{formatMoney(p.price)}</strong>
                            </div>

                            <p style={{ margin: 0, color: "rgba(0,0,0,0.7)", fontSize: 14 }}>{p.description}</p>

                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13 }}>
                                <span style={{ color: "rgba(0,0,0,0.7)" }}>{stockLabel(p)}</span>
                                <span style={{ fontWeight: 700 }}>
                                    {p.fulfillment === "ready" ? "Ready-to-ship" : "Made-to-order"}
                                </span>
                            </div>

                            <button
                                disabled={isSoldOut}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(0,0,0,0.18)",
                                    background: isSoldOut ? "rgba(0,0,0,0.05)" : "black",
                                    color: isSoldOut ? "rgba(0,0,0,0.4)" : "white",
                                    fontWeight: 800,
                                    cursor: isSoldOut ? "not-allowed" : "pointer",
                                }}
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
