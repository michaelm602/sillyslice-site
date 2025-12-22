import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="site-header">
            <div className="site-header-inner">
                <div className="brand">
                    <div className="brand-mark" />
                    <strong className="brand-name">Silly Slice</strong>
                </div>

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
