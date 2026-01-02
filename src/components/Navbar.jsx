import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="site-header">
            <div className="site-header-inner">
                <NavLink to="/" className="brand">
                    <picture>
                        <source srcSet="/logo-mark-dark.png" media="(prefers-color-scheme: dark)" />
                        <source srcSet="/logo-mark-light.png" media="(prefers-color-scheme: light)" />
                        <img src="/logo-mark-dark.png" alt="Silly Slice logo" className="brand-mark" />
                    </picture>

                    <strong className="brand-name">Silly Slice</strong>
                </NavLink>



                <nav className="nav">
                    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Home
                    </NavLink>

                    <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Shop
                    </NavLink>

                    <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        About
                    </NavLink>

                    <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Contact
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
