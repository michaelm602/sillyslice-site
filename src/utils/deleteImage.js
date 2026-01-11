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
    await deleteObject(ref(storage, finalPath));
    return finalPath;
}
