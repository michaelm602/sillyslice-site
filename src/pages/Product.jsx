import { useMemo } from "react";
import { useParams } from "react-router-dom";
import SafeImage from "../components/SafeImage";
import { products } from "../data/products";

export default function Product() {
    const { id } = useParams();

    const product = useMemo(
        () => products.find((p) => String(p.id) === String(id)),
        [id]
    );

    const fallbackImg = `${import.meta.env.BASE_URL}products/placeholder1.png`;

    if (!product) {
        return (
            <div className="shop-page">
                <h1 className="shop-title">Not found</h1>
                <p className="shop-subtitle">That product doesn’t exist (yet).</p>
                <a className="toy-link" href="#/shop">← Back to shop</a>
            </div>
        );
    }

    const stockText =
        product.qty === null || product.qty === undefined
            ? "Made-to-order"
            : `In stock: ${product.qty}`;

    const badgeClass =
        product.fulfillment === "ready"
            ? "toy-badge ready"
            : product.fulfillment === "made"
                ? "toy-badge mto"
                : "toy-badge";

    const badgeText =
        product.fulfillment === "ready"
            ? "Ready-to-ship"
            : product.fulfillment === "made"
                ? `Made-to-order${product.leadDays ? ` • ${product.leadDays}d` : ""}`
                : "—";

    const price =
        Number.isFinite(Number(product.price)) ? `$${Number(product.price).toFixed(2)}` : "";

    return (
        <div className="shop-page" style={{ gap: 14 }}>
            <a className="toy-link" href="#/shop">← Back to shop</a>

            <section className="card" style={{ padding: 18 }}>
                <div
                    style={{
                        display: "grid",
                        gap: 16,
                        gridTemplateColumns: "1.15fr 0.85fr",
                        alignItems: "start",
                    }}
                    className="product-detail-grid"
                >
                    <div className="toy-imgWrap" style={{ height: 320, borderRadius: 18 }}>
                        <span className="img-sheen" aria-hidden="true" />
                        <SafeImage
                            className="toy-img"
                            src={product.image || product.imageUrl || fallbackImg}
                            fallbackSrc={fallbackImg}
                            alt={product.name}
                        />
                    </div>

                    <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
                        <h1 style={{ margin: 0, letterSpacing: "-0.02em" }}>{product.name}</h1>

                        <div style={{ fontWeight: 900, fontSize: 18 }}>{price}</div>

                        <div className="toy-meta" style={{ marginTop: 0 }}>
                            <span>{stockText}</span>
                            <span className={badgeClass}>{badgeText}</span>
                        </div>

                        {product.description ? (
                            <p className="toy-blurb" style={{ fontSize: 15 }}>
                                {product.description}
                            </p>
                        ) : null}

                        <button className="btn btn-primary" disabled title="Checkout coming soon">
                            Add to cart (coming soon)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
