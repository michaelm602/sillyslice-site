import { useMemo, useState } from "react";
import useProducts from "../hooks/useProducts";
import { categories } from "../data/products";
import ToyCard from "../components/ToyCard";

export default function Shop() {
    const [cat, setCat] = useState("all");
    const { products, loading } = useProducts();

    const filtered = useMemo(() => {
        if (cat === "all") return products;
        return products.filter((p) => p.category === cat);
    }, [cat, products]);

    const categoryOptions = useMemo(() => {
        return [{ id: "all", name: "All" }, ...categories];
    }, []);

    const fallbackImg = import.meta.env.BASE_URL + "products/placeholder1.png";

    return (
        <div className="shop-page">
            <div className="shop-top">
                <div>
                    <h1 className="shop-title">Shop</h1>
                    <p className="shop-subtitle">
                        {loading
                            ? "Loading products…"
                            : "Placeholder products for now — Audrey will upload the real ones later."}
                    </p>
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
                <div className="toy-grid">
                    {filtered.map((p) => (
                        <ToyCard
                            key={p.id}
                            product={p}
                            to={`/shop/${p.id}`}
                            linkText="View →"
                            fallbackImg={`${import.meta.env.BASE_URL}products/placeholder1.png`}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
