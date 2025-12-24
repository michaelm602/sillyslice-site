// src/components/Footer.jsx
export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <span>© {new Date().getFullYear()} Silly Slice</span>
                <span>3D Printed Fidget &amp; Sensory Toys</span>
            </div>
        </footer>
    );
}