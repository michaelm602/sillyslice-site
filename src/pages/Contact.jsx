export default function Contact() {
    return (
        <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
            <h1 style={{ margin: 0 }}>Contact</h1>
            <p style={{ color: "rgba(0,0,0,0.75)" }}>
                Want a custom color, size, or a weird request? Cool. We’ll add a real form later.
            </p>

            <div
                style={{
                    padding: 18,
                    borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(0,0,0,0.03)",
                }}
            >
                <strong>Email:</strong> sillyslice7@gmail.com
            </div>
        </div>
    );
}
