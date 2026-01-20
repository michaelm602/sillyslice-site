// src/hooks/useInquiries.js
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function useInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ref = collection(db, "inquiries");
        const q = query(ref, orderBy("createdAt", "desc"));

        const unsub = onSnapshot(
            q,
            (snap) => {
                const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setInquiries(rows);
                setLoading(false);
            },
            (err) => {
                console.error("useInquiries:", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    return { inquiries, loading };
}
