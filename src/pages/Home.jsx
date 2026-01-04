import { Link } from "react-router-dom";
import ToyCard from "../components/ToyCard";


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
            <section className="card-soft home-next">
                <h2 className="home-next__title">What we’re building next</h2>

                <ul className="home-next__list">
                    <li>Real product photos (uploaded by Audrey in admin)</li>
                    <li>Inventory tracking (ready-to-ship counts)</li>
                    <li>Made-to-order lead times</li>
                    <li>PayPal checkout</li>
                </ul>
            </section>

            <section className="card-soft featured">
                <h2 className="featured-title">Featured toys</h2>
                <p className="featured-subtitle">
                    (Placeholder for now — Audrey will upload the real product photos later.)
                </p>

                <div className="toy-grid">
                    {[
                        {
                            id: "feat-gear-clicker",
                            name: "Gear Clicker",
                            image: `${base}products/placeholder1.png`,
                            description: "Clicky little fidget. Loud enough to be satisfying.",
                            price: 9.99,
                            fulfillment: "ready",
                            qty: 12,
                        },
                        {
                            id: "feat-flex-dino",
                            name: "Flex Dino",
                            image: `${base}products/placeholder2.webp`,
                            description: "Bendy, durable, and weirdly addictive.",
                            price: 14.99,
                            fulfillment: "made",
                            leadDays: 3,
                            qty: null,
                        },
                        {
                            id: "feat-infinity-cube",
                            name: "Infinity Cube",
                            image: `${base}products/placeholder3.jpg`,
                            description: "Smooth folds. Pocket-friendly stress killer.",
                            price: 12.99,
                            fulfillment: "ready",
                            qty: 5,
                        },
                        {
                            id: "feat-puzzle-keychain",
                            name: "Puzzle Keychain",
                            image: `${base}products/placeholder4.jpg`,
                            description: "Tiny brain teaser you can carry anywhere.",
                            price: 6.99,
                            fulfillment: "ready",
                            qty: 9,
                        },
                    ].map((p) => (
                        <ToyCard
                            key={p.id}
                            product={p}
                            href="#/shop"
                            linkText="View in shop →"
                            fallbackImg={`${base}products/placeholder1.png`}
                        />
                    ))}
                </div>
            </section>




        </div>
    );
}
