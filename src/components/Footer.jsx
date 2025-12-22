export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "18px 24px" }}>
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    color: "rgba(0,0,0,0.7)",
                    fontSize: 14,
                }}
            >
                <span>© {new Date().getFullYear()} Silly Slice</span>
                <span>3D Printed Fidget & Sensory Toys</span>
            </div>
        </footer>
    );
}
