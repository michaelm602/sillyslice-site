export default function Contact() {
    return (
        <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
            <h1 style={{ margin: 0 }}>Contact</h1>

            <p style={{ color: "var(--muted)", margin: 0 }}>
                Want a custom color, size, or a weird request? Cool. We’ll add a real form later.
            </p>

            <div className="card-soft" style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 900 }}>Email:</span>

                    <a
                        href="mailto:sillyslice7@gmail.com"
                        style={{
                            color: "var(--text)",
                            textDecoration: "none",
                            fontWeight: 800,
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                        }
                    >
                        sillyslice7@gmail.com
                    </a>

                    <span
                        className="product-badge mto"
                        style={{ marginLeft: "auto" }}
                        title="We’ll respond when we can"
                    >
                        24–48h-ish
                    </span>
                </div>

                <p style={{ marginTop: 10, marginBottom: 0, color: "var(--muted2)", fontSize: 14 }}>
                    Include the toy name, preferred colors, and whether it’s “ready-to-ship” or “made-to-order” vibes.
                </p>
            </div>
        </div>
    );
}
