// src/pages/Admin.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import useSiteContent from "../hooks/useSiteContent";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { localSiteContent } from "../data/siteContent";
import { useNavigate } from "react-router-dom";


export default function Admin() {
    const navigate = useNavigate();
    const { content, usingRemote, loading, error } = useSiteContent();


    async function seedSiteContent() {
        await setDoc(doc(db, "siteContent", "main"), localSiteContent, { merge: false });
        alert("Seeded Firestore: siteContent/main");
    }

    async function pushCurrentToFirestore() {
        // if you ever want to push whatever you're currently viewing (merged result)
        await setDoc(doc(db, "siteContent", "main"), content, { merge: false });
        alert("Overwrote Firestore with current content");
    }

    return (
        <div className="card" style={{ padding: 24 }}>
            <h1>Admin</h1>

            <p>
                Status:{" "}
                <strong>
                    {loading ? "Loading…" : usingRemote ? "Connected to Firestore" : "Using local fallback"}
                </strong>
            </p>

            {error ? <p style={{ color: "salmon" }}>{error}</p> : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                <button className="btn" onClick={seedSiteContent}>
                    Seed Firestore from local defaults
                </button>

                <button className="btn" onClick={pushCurrentToFirestore} title="Optional">
                    Overwrite Firestore with current content
                </button>

                <button
                    className="btn"
                    onClick={async () => {
                        await signOut(auth);
                        navigate("/", { replace: true });
                    }}
                >
                    Log out
                </button>
            </div>

            <pre style={{ marginTop: 16, fontSize: 13 }}>
                {JSON.stringify(content, null, 2)}
            </pre>
        </div>
    );
}
