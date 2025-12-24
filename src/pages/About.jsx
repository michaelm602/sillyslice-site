export default function About() {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            <section className="card-soft" style={{ padding: 22 }}>
                <h1 style={{ marginTop: 0, marginBottom: 10 }}>About</h1>

                <p style={{ color: "var(--muted)", maxWidth: 760, margin: 0 }}>
                    Silly Slice makes 3D printed fidget + sensory toys. Some items are
                    ready-to-ship, others are made-to-order. We’ll be adding photos,
                    inventory, and checkout as we build.
                </p>
            </section>
        </div>
    );
}
