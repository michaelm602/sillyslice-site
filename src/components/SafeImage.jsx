import { useEffect, useRef, useState } from "react";

export default function SafeImage({
    src,
    alt = "",
    fallbackSrc,
    className = "",
    ...props
}) {
    const imgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
        setLoaded(false);
        setCurrentSrc(src);
    }, [src]);

    // If the image is already cached, onLoad may not fire on route changes.
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        // Let the browser apply src first, then check if it’s already complete.
        const id = requestAnimationFrame(() => {
            if (img.complete && img.naturalWidth > 0) {
                setLoaded(true);
            }
        });

        return () => cancelAnimationFrame(id);
    }, [currentSrc]);

    return (
        <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`${className} ${loaded ? "is-loaded" : ""}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
                if (fallbackSrc && currentSrc !== fallbackSrc) {
                    setCurrentSrc(fallbackSrc);
                }
            }}
            {...props}
        />
    );
}
