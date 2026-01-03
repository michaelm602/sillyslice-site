import { Link } from "react-router-dom";

export default function Home() {
    const base = import.meta.env.BASE_URL;

    return (
        <div style={{ display: "grid", gap: 18 }}>
            {/* Hero */}
            <section
                className="card hero"
                style={{
                    padding: 28,
                    backgroundImage: `
            linear-gradient(180deg,
              color-mix(in srgb, var(--panel-2) 70%, transparent),
              color-mix(in srgb, var(--bg) 35%, transparent)
            ),
            url("${base}hero/printer.jpg")
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <img
                    src={`${base}logo-hero.png`}
                    alt="Silly Slice"
                    style={{
                        width: "clamp(140px, 14vw, 190px)",
                        height: "auto",
                        display: "block",
                        margin: 0,
                        opacity: 0.95,
                    }}
                />

                <h1 className="sr-only">Silly Slice</h1>

                <p
                    style={{
                        marginTop: 10,
                        maxWidth: 700,
                        fontSize: 16,
                    }}
                >
                    3D printed fidget + sensory toys. Some are ready-to-ship, some are
                    made-to-order. Either way, we keep it satisfying.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        marginTop: 16,
                    }}
                >
                    <Link to="/shop" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        Shop toys
                    </Link>

                    <Link to="/contact" className="btn" style={{ textDecoration: "none" }}>
                        Custom request
                    </Link>
                </div>
            </section>

            {/* Next steps */}
            <section className="card-soft" style={{ padding: 22 }}>
                <h2 style={{ marginTop: 0 }}>What we’re building next</h2>

                <ul
                    style={{
                        margin: 0,
                        paddingLeft: 18,
                        color: "var(--muted)",
                    }}
                >
                    <li>Real product photos (uploaded by Audrey in admin)</li>
                    <li>Inventory tracking (ready-to-ship counts)</li>
                    <li>Made-to-order lead times</li>
                    <li>PayPal checkout</li>
                </ul>
            </section>
        </div>
    );
}
