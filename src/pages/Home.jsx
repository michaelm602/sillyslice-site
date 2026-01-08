// src/pages/Home.jsx
import { Link } from "react-router-dom";
import ToyCard from "../components/ToyCard";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts";
import { siteContent } from "../data/siteContent";

export default function Home() {
    const base = import.meta.env.BASE_URL;
    const featured = useFeaturedProducts();

    const hero = siteContent.hero;
    const home = siteContent.home;

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
            url("${hero.image}")
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <img
                    src={`${base}logo-hero.png`}
                    alt={siteContent.brandName}
                    style={{
                        width: "clamp(140px, 14vw, 190px)",
                        height: "auto",
                        display: "block",
                        margin: 0,
                        opacity: 0.95,
                    }}
                />

                <h1 className="sr-only">{siteContent.brandName}</h1>

                <p style={{ marginTop: 10, maxWidth: 700, fontSize: 16 }}>
                    {hero.subhead}
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    <Link to="/shop" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        {hero.ctaText}
                    </Link>

                    <Link to="/contact" className="btn" style={{ textDecoration: "none" }}>
                        {hero.secondaryText}
                    </Link>
                </div>
            </section>

            {/* Next steps */}
            <section className="card-soft home-next">
                <h2 className="home-next__title">{home.nextTitle}</h2>

                <ul className="home-next__list">
                    {home.nextItems.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            {/* Featured */}
            <section className="card-soft featured">
                <h2 className="featured-title">{home.featuredTitle}</h2>
                <p className="featured-subtitle">{home.featuredSubtitle}</p>

                <div className="toy-grid">
                    {featured.map((p) => (
                        <ToyCard
                            key={p.id}
                            product={p}
                            href={`#/shop/${p.id}`}

                            linkText="View in shop →"
                            fallbackImg={`${base}products/placeholder1.png`}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
