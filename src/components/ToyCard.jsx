import { useMemo } from "react";
import SafeImage from "./SafeImage";
import { Link } from "react-router-dom";

export default function ToyCard({
    product,
    to = "/shop",
    linkText = "View →",
    // allow caller to pass a fallback, but we will ONLY use it in DEV
    fallbackImg,
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

    const isDev = import.meta.env.DEV;
    const devFallback = `${import.meta.env.BASE_URL}products/placeholder1.png`;

    const hasRealImage =
        typeof product?.image === "string" && product.image.trim() !== "";

    // ✅ In PROD, we do NOT force placeholders.
    // ✅ In DEV, we can fall back so you can build UI.
    const src = hasRealImage
        ? product.image
        : isDev
            ? (fallbackImg || devFallback)
            : "";

    return (
        <div className="toy-card">
            <div className="toy-imgWrap">
                <span className="img-sheen" aria-hidden="true" />

                {src ? (
                    <SafeImage
                        className="toy-img"
                        src={src}
                        // ✅ fallback only in DEV
                        fallbackSrc={isDev ? (fallbackImg || devFallback) : undefined}
                        alt={product?.name || "Toy"}
                    />
                ) : (
                    <div
                        style={{
                            height: 170,
                            display: "grid",
                            placeItems: "center",
                            opacity: 0.75,
                            padding: 10,
                            textAlign: "center",
                        }}
                    >
                        Image coming soon
                    </div>
                )}
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
