// src/utils/uploadImage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// returns { url, path }
export async function uploadProductImage({ file, productId, kind = "main" }) {
    if (!file) throw new Error("No file provided");

    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");

    const path =
        kind === "main"
            ? `products/${productId}/main-${Date.now()}-${safeName}`
            : `products/${productId}/gallery/${Date.now()}-${safeName}`;

    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return { url, path };
}
