// src/utils/inquiries.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates a customer inquiry in Firestore.
 * Only whitelisted fields are written — no payload spreading.
 */
export async function createInquiry(payload) {
    const name    = String(payload?.customer?.name  ?? "").trim();
    const email   = String(payload?.customer?.email ?? "").trim();
    const message = String(payload?.message         ?? "").trim();

    if (!name)                    throw new Error("Name is required.");
    if (!email)                   throw new Error("Email is required.");
    if (!email.includes("@"))     throw new Error("Invalid email address.");
    if (!message)                 throw new Error("Message is required.");

    const quantity   = Math.max(1, Number(payload?.request?.quantity) || 1);
    const productUrl = String(payload?.request?.productUrl ?? "").trim().slice(0, 500);

    const p = payload?.product ?? null;
    const product = p
        ? {
              id:          String(p.id          ?? ""),
              name:        String(p.name        ?? ""),
              image:       String(p.image       ?? ""),
              fulfillment: String(p.fulfillment ?? ""),
              leadDays:    p.leadDays ?? null,
              qty:         p.qty      ?? null,
              price:       typeof p.price === "number" ? p.price : null,
              snapshotAt:  p.snapshotAt ?? null,
          }
        : null;

    const meta = {
        path:      String(payload?.meta?.path      ?? "").slice(0, 200),
        referrer:  String(payload?.meta?.referrer  ?? "").slice(0, 500),
        userAgent: String(payload?.meta?.userAgent ?? "").slice(0, 500),
    };

    const doc = {
        customer: { name, email },
        message,
        request:  { quantity, productUrl },
        product,
        meta,
        status:    "new",
        source:    "sillyslice-site",
        createdAt: serverTimestamp(),
    };

    const ref = collection(db, "inquiries");
    const res = await addDoc(ref, doc);
    return res.id;
}
