import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: "inherit",
    background: isActive ? "rgba(0,0,0,0.08)" : "transparent",
    fontWeight: isActive ? 700 : 500,
});

export default function Navbar() {
    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.85)",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
                        }}
                    />
                    <strong style={{ letterSpacing: 0.2 }}>Silly Slice</strong>
                </div>

                <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <NavLink to="/" style={linkStyle}>
                        Home
                    </NavLink>
                    <NavLink to="/shop" style={linkStyle}>
                        Shop
                    </NavLink>
                    <NavLink to="/about" style={linkStyle}>
                        About
                    </NavLink>
                    <NavLink to="/contact" style={linkStyle}>
                        Contact
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
