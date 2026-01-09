// src/hooks/useSiteContent.js
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { localSiteContent } from "../data/siteContent";

function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
}

// Deep merge remote -> local (remote wins)
function deepMerge(base, override) {
    if (!isPlainObject(base)) return override;
    if (!isPlainObject(override)) return override ?? base;

    const out = { ...base };
    for (const key of Object.keys(override)) {
        const a = base[key];
        const b = override[key];
        out[key] = isPlainObject(a) && isPlainObject(b) ? deepMerge(a, b) : b;
    }
    return out;
}

export default function useSiteContent() {
    const [remote, setRemote] = useState(null);
    const [usingRemote, setUsingRemote] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        async function run() {
            setLoading(true);
            setError("");

            try {
                const ref = doc(db, "siteContent", "main");
                const snap = await getDoc(ref);

                if (!alive) return;

                if (snap.exists()) {
                    const data = snap.data() || {};
                    setRemote(data);
                    setUsingRemote(true);
                } else {
                    setRemote(null);
                    setUsingRemote(false);
                }
            } catch (e) {
                if (!alive) return;
                setRemote(null);
                setUsingRemote(false);
                setError(e?.message || String(e));
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, []);

    const content = useMemo(() => {
        // Merge remote over local so missing fields don’t break pages
        return remote ? deepMerge(localSiteContent, remote) : localSiteContent;
    }, [remote]);

    return { content, usingRemote, loading, error };
}
