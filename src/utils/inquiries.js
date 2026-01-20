// src/utils/inquiries.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates a customer inquiry in Firestore.
 * Writes to collection: inquiries
 */
export async function createInquiry(payload) {
    const ref = collection(db, "inquiries");

    const doc = {
        ...payload,
        status: "new",
        createdAt: serverTimestamp(),
        source: "sillyslice-site",
    };

    const res = await addDoc(ref, doc);
    return res.id;
}
