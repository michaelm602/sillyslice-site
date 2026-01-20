import { useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SafeImage from "../components/SafeImage";
import useProducts from "../hooks/useProducts";
import Lightbox from "../components/Lightbox";

export default function Product() {
    const { id } = useParams();
    const { products, loading } = useProducts();

    const navigate = useNavigate();

    const product = useMemo(
        () => products.find((p) => String(p.id) === String(id)),
        [products, id]
    );

    const fallbackImg = `${import.meta.env.BASE_URL}products/placeholder1.png`;

    // Build image list: main first, then gallery
    const images = useMemo(() => {
        if (!product) return [];
        const main = product.image || product.imageUrl || "";
        const gallery = Array.isArray(product.gallery) ? product.gallery : [];
        const raw = [main, ...gallery].filter(Boolean);

        // de-dupe
        const seen = new Set();
        const out = [];
        for (const url of raw) {
            if (seen.has(url)) continue;
            seen.add(url);
            out.push(url);
        }
        return out.length ? out : [fallbackImg];
    }, [product, fallbackImg]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [lbOpen, setLbOpen] = useState(false);

    const heroSrc = images[activeIndex] || images[0] || fallbackImg;

    const onPrev = useCallback(() => {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const onNext = useCallback(() => {
        setActiveIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    if (loading && !product) {
        return (
            <div className="shop-page">
                <Link className="toy-link" to="/shop">← Back to shop</Link>
                <h1 className="shop-title">Loading…</h1>
                <p className="shop-subtitle">Fetching the toy stash.</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="shop-page">
                <h1 className="shop-title">Not found</h1>
                <p className="shop-subtitle">That product doesn’t exist (yet).</p>
                <Link className="toy-link" to="/shop">← Back to shop</Link>
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
        Number.isFinite(Number(product.price))
            ? `$${Number(product.price).toFixed(2)}`
            : "";

    return (
        <div className="shop-page" style={{ gap: 14 }}>
            <Link className="toy-link" to="/shop">← Back to shop</Link>

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
                    {/* LEFT: hero + thumbs */}
                    <div style={{ display: "grid", gap: 10 }}>
                        <button
                            className="product-heroBtn"
                            onClick={() => setLbOpen(true)}
                            type="button"
                        >
                            <div className="product-heroFrame">
                                <SafeImage
                                    className="toy-img"
                                    src={heroSrc}
                                    fallbackSrc={fallbackImg}
                                    alt={product.name}
                                />
                            </div>
                            <span className="product-zoomTag">Zoom</span>
                        </button>

                        {images.length > 1 ? (
                            <div className="thumb-grid">
                                {images.map((src, idx) => (
                                    <button
                                        key={`${src}-${idx}`}
                                        className={`thumb-btn ${idx === activeIndex ? "active" : ""}`}
                                        onClick={() => setActiveIndex(idx)}
                                        type="button"
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <SafeImage className="thumb-img" src={src} fallbackSrc={fallbackImg} alt="" />
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {/* RIGHT: info */}
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

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                                const productUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/shop/${id}`;

                                navigate("/contact", {
                                    state: {
                                        from: "product",
                                        product: {
                                            id: product.id,
                                            name: product.name,
                                            slug: product.slug || "",
                                            image: product.image || product.imageUrl || heroSrc,
                                            fulfillment: product.fulfillment || "",
                                            leadDays: product.leadDays ?? null,
                                            qty: product.qty ?? null,
                                            price: product.price ?? null,
                                        },
                                        request: {
                                            quantity: 1,
                                            productUrl,
                                        },
                                    },
                                });
                            }}
                        >
                            Request order
                        </button>

                    </div>
                </div>
            </section>

            <Lightbox
                open={lbOpen}
                images={images}
                index={activeIndex}
                onClose={() => setLbOpen(false)}
                onPrev={onPrev}
                onNext={onNext}
            />
        </div>
    );
}
