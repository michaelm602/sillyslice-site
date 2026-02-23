import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SafeImage from "../components/SafeImage";
import { createInquiry } from "../utils/inquiries";
import { serverTimestamp } from "firebase/firestore";


export default function Contact() {
    const location = useLocation();

    const prefill = useMemo(() => {
        const s = location.state || {};
        const p = s.product || null;
        const r = s.request || {};
        return {
            product: p,
            quantity: Number(r.quantity || 1),
            productUrl: r.productUrl || "",
        };
    }, [location.state]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(
        prefill.product
            ? `Hi! I want to order "${prefill.product.name}".\nPreferred colors:\nQuantity: ${prefill.quantity}\nNotes:`
            : ""
    );

    const [quantity, setQuantity] = useState(prefill.quantity || 1);

    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [error, setError] = useState("");

    const fallbackImg = `${import.meta.env.BASE_URL}products/placeholder1.png`;

    const fulfillmentText = useMemo(() => {
        const p = prefill.product;
        if (!p) return "";
        if (p.fulfillment === "ready") {
            if (p.qty === 0) return "Ready-to-ship • SOLD OUT";
            if (typeof p.qty === "number") return `Ready-to-ship • In stock: ${p.qty}`;
            return "Ready-to-ship";
        }
        if (p.fulfillment === "made") {
            return `Made-to-order${p.leadDays ? ` • ${p.leadDays}d` : ""}`;
        }
        return "";
    }, [prefill.product]);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        // bare-minimum validation
        if (!name.trim()) return setError("Name is required.");
        if (!email.trim()) return setError("Email is required.");
        if (!email.includes("@")) return setError("Email looks off. Fix it and try again.");
        if (!message.trim()) return setError("Message is required.");

        setStatus("sending");

        try {
            const p = prefill.product;

            await createInquiry({
                customer: {
                    name: name.trim(),
                    email: email.trim(),
                },
                message: message.trim(),
                request: {
                    quantity: Math.max(1, Number(quantity) || 1),
                    productUrl: prefill.productUrl || "",
                },
                product: p
                    ? {
                        id: p.id ?? "",
                        name: p.name ?? "",
                        image:
                            (p.image && String(p.image).trim()) ||
                            `${import.meta.env.BASE_URL}products/placeholder1.png`,
                        fulfillment: p.fulfillment ?? "",
                        leadDays: p.leadDays ?? null,
                        qty: p.qty ?? null,
                        price:
                            typeof p.price === "number" ? p.price : (p.price ?? null),

                        // 🔒 snapshot metadata
                        snapshotAt: serverTimestamp(),
                    }
                    : null,

                meta: {
                    path: location.pathname,
                    referrer: document.referrer || "",
                    userAgent: navigator.userAgent || "",
                },
            });

            setStatus("sent");

            // optional: clear form but keep product info visible
            // setName(""); setEmail(""); setMessage(""); setQuantity(1);

            // console.log("Inquiry created:", inquiryId);
        } catch (err) {
            console.error(err);
            setStatus("error");
            setError("Something broke while sending. Try again, or email us directly.");
        }
    }

    return (
        <div style={{ display: "grid", gap: 12, maxWidth: 720, margin: "0 auto", width: "100%" }}>
            <h1 style={{ margin: 0 }}>Contact</h1>

            <p style={{ color: "var(--muted)", margin: 0 }}>
                Want a custom color, size, or a weird request? Cool. Drop it here.
            </p>

            {/* Prefill product card */}
            {prefill.product ? (
                <div className="card-soft" style={{ padding: 18, display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", flex: "0 0 auto" }}>
                            <SafeImage
                                src={prefill.product.image || fallbackImg}
                                fallbackSrc={fallbackImg}
                                alt={prefill.product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>

                        <div style={{ display: "grid", gap: 2 }}>
                            <div style={{ fontWeight: 950, letterSpacing: "-0.01em" }}>{prefill.product.name}</div>
                            {fulfillmentText ? (
                                <div style={{ color: "var(--muted2)", fontSize: 13 }}>{fulfillmentText}</div>
                            ) : null}
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                                <Link className="toy-link" to={`/shop/${prefill.product.id}`}>
                                    View product
                                </Link>
                                <Link className="toy-link" to="/shop">
                                    Browse shop
                                </Link>
                            </div>
                        </div>
                    </div>

                    {prefill.productUrl ? (
                        <div style={{ color: "var(--muted2)", fontSize: 12, wordBreak: "break-all" }}>
                            Link: {prefill.productUrl}
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="card-soft" style={{ padding: 18 }}>
                    <div style={{ color: "var(--muted2)", fontSize: 14 }}>
                        No product selected — that’s fine. Tell us what you’re looking for.
                    </div>
                </div>
            )}

            {/* Form */}
            <form className="card" style={{ padding: 18, display: "grid", gap: 12 }} onSubmit={onSubmit}>
                <div style={{ display: "grid", gap: 6 }}>
                    <label htmlFor="contact-name" style={{ fontWeight: 900 }}>Name</label>
                    <input
                        id="contact-name"
                        className="input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <label htmlFor="contact-email" style={{ fontWeight: 900 }}>Email</label>
                    <input
                        id="contact-email"
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <label htmlFor="contact-qty" style={{ fontWeight: 900 }}>Quantity</label>
                    <input
                        id="contact-qty"
                        className="input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <label htmlFor="contact-message" style={{ fontWeight: 900 }}>Message</label>
                    <textarea
                        id="contact-message"
                        className="input"
                        style={{ minHeight: 150, resize: "vertical" }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Preferred colors, notes, etc."
                    />
                </div>

                {error ? (
                    <div style={{ color: "var(--danger, #ff6b6b)", fontWeight: 800 }}>{error}</div>
                ) : null}

                {status === "sent" ? (
                    <div style={{ color: "var(--text)", fontWeight: 900 }}>
                        ✅ Sent. We’ll hit you back soon.
                    </div>
                ) : null}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                        {status === "sending" ? "Sending…" : "Send request"}
                    </button>

                    <a
                        className="btn"
                        href="mailto:sillyslice7@gmail.com"
                        style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                        Or email us
                    </a>
                </div>

                <div style={{ color: "var(--muted2)", fontSize: 13 }}>
                    Typical response time: <strong>within 48 hours</strong>
                </div>
            </form>
        </div>
    );
}
