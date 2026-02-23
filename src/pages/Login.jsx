// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setBusy(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin");
        } catch (err) {
            setError(err?.message || "Login failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="card" style={{ padding: 24, maxWidth: 420, margin: "40px auto" }}>
            <h1 style={{ marginTop: 0 }}>Admin Login</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label className="shop-label">
                    Email
                    <input
                        style={{ width: "100%", marginTop: 6 }}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="shop-label">
                    Password
                    <input
                        style={{ width: "100%", marginTop: 6 }}
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && (
                    <p style={{ margin: 0, color: "salmon", fontSize: 14 }}>
                        {error}
                    </p>
                )}

                <button className="btn btn-primary" type="submit" disabled={busy}>
                    {busy ? "Logging in…" : "Log in"}
                </button>

                <Link className="toy-link" to="/">
                    ← Back to home
                </Link>
            </form>
        </div>
    );
}
