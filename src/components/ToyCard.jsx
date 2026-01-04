import { useMemo } from "react";

export default function ToyCard({
    product,
    href = "#/shop",
    linkText = "View →",
    fallbackImg = "/products/placeholder1.png",
}) {
    const badge = useMemo(() => {
        const fulfillment = product?.fulfillment;

        const className =
            fulfillment === "ready"
                ? "toy-badge ready"
                : fulfillment === "made"
                    ? "toy-badge mto"
                    : "toy-badge";

        const text =
            fulfillment === "ready"
                ? "Ready-to-ship"
                : fulfillment === "made"
                    ? `Made-to-order${product?.leadDays ? ` • ${product.leadDays}d` : ""}`
                    : "—";

        return { className, text };
    }, [product]);

    const stockText = useMemo(() => {
        if (!product) return "";
        return product.qty === null || product.qty === undefined
            ? "Made-to-order"
            : `In stock: ${product.qty}`;
    }, [product]);

    const priceText = useMemo(() => {
        if (!product || product.price === undefined || product.price === null) return null;
        const n = Number(product.price);
        return Number.isFinite(n) ? `$${n.toFixed(2)}` : null;
    }, [product]);

    return (
        <div className="toy-card">
            <div className="toy-imgWrap">
                <img
                    className="toy-img"
                    src={product?.image || product?.imageUrl || fallbackImg}
                    alt={product?.name || "Toy"}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImg;
                    }}
                />
            </div>

            <div className="toy-body">
                <div className="toy-name">{product?.name}</div>

                {product?.description ? (
                    <p className="toy-blurb">{product.description}</p>
                ) : null}

                {/* Only show meta row if we actually have fulfillment/qty */}
                {(product?.fulfillment || product?.qty !== undefined) && (
                    <div className="toy-meta">
                        <span>{stockText}</span>
                        <span className={badge.className}>{badge.text}</span>
                    </div>
                )}

                {/* Price + link row */}
                <div className="toy-meta" style={{ marginTop: 0 }}>
                    <span style={{ fontWeight: 900 }}>{priceText}</span>
                    <a className="toy-link" href={href}>
                        {linkText}
                    </a>
                </div>
            </div>
        </div>
    );
}
