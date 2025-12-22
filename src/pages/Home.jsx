import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ display: "grid", gap: 18 }}>
            <section
                style={{
                    padding: 28,
                    borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.04), transparent)",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 40, letterSpacing: -0.6 }}>Silly Slice</h1>
                <p style={{ marginTop: 10, maxWidth: 700, fontSize: 16, color: "rgba(0,0,0,0.75)" }}>
                    3D printed fidget + sensory toys. Some are ready-to-ship, some are made-to-order. Either way, we keep it
                    satisfying.
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    <Link to="/shop" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        Shop toys
                    </Link>

                    <Link to="/contact" className="btn" style={{ textDecoration: "none" }}>
                        Custom request
                    </Link>
                </div>
            </section>

            <section
                style={{
                    padding: 22,
                    borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.08)",
                }}
            >
                <h2 style={{ marginTop: 0 }}>What we’re building next</h2>
                <ul style={{ margin: 0, paddingLeft: 18, color: "rgba(0,0,0,0.75)" }}>
                    <li>Real product photos (uploaded by Audrey in admin)</li>
                    <li>Inventory tracking (ready-to-ship counts)</li>
                    <li>Made-to-order lead times</li>
                    <li>PayPal checkout</li>
                </ul>
            </section>
        </div>
    );
}
