import { useMemo } from "react";
import SafeImage from "./SafeImage";
import { Link } from "react-router-dom";

export default function ToyCard({
    product,
    to = "/shop",
    linkText = "View →",
    fallbackImg = `${import.meta.env.BASE_URL}products/placeholder1.png`,
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

    const src = product?.image || product?.imageUrl || fallbackImg;

    return (
        <div className="toy-card">
            <div className="toy-imgWrap">
                <span className="img-sheen" aria-hidden="true" />

                <SafeImage
                    className="toy-img"
                    src={src}
                    fallbackSrc={fallbackImg}
                    alt={product?.name || "Toy"}
                />
            </div>

            <div className="toy-body">
                <div className="toy-name">{product?.name}</div>

                {product?.description ? <p className="toy-blurb">{product.description}</p> : null}

                {(product?.fulfillment || product?.qty !== undefined) && (
                    <div className="toy-meta">
                        <span>{stockText}</span>
                        <span className={badge.className}>{badge.text}</span>
                    </div>
                )}

                <div className="toy-meta" style={{ marginTop: 0 }}>
                    <span style={{ fontWeight: 900 }}>{priceText}</span>

                    <Link className="toy-link" to={to}>
                        {linkText}
                    </Link>
                </div>
            </div>
        </div>
    );
}
