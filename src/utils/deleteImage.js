// src/utils/deleteImage.js
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

function extractStoragePathFromUrl(url) {
    try {
        const decoded = decodeURIComponent(url);
        const match = decoded.match(/\/o\/(.+?)\?/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

export async function deleteStorageImage({ path, url }) {
    const finalPath = path || extractStoragePathFromUrl(url);

    if (!finalPath) {
        throw new Error(
            "Could not determine Storage path. (Store draft.galleryPaths[url] / draft.imagePath.)"
        );
    }

    try {
        await deleteObject(ref(storage, finalPath));
    } catch (err) {
        // ✅ If the file is already gone, treat as success
        if (err?.code === "storage/object-not-found") {
            console.warn("[deleteStorageImage] Already deleted:", finalPath);
            return finalPath;
        }

        // Anything else is a real error (permissions, etc.)
        throw err;
    }

    return finalPath;
}
