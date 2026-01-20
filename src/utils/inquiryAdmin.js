// src/utils/inquiryAdmin.js
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function setInquiryStatus(inquiryId, status) {
    const ref = doc(db, "inquiries", inquiryId);
    await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
    });
}

export async function setInquiryAdminNote(inquiryId, note) {
    const ref = doc(db, "inquiries", inquiryId);
    await updateDoc(ref, {
        adminNote: note,
        updatedAt: serverTimestamp(),
    });
}
