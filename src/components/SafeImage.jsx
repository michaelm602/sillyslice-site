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

    // ✅ Smart src change: if cached, mark loaded immediately (no flicker)
    useEffect(() => {
        if (!src) return;

        // If it's the same src, don't thrash state
        setCurrentSrc((prev) => (prev === src ? prev : src));

        let cancelled = false;

        const probe = new Image();
        probe.src = src;

        if (probe.complete && probe.naturalWidth > 0) {
            // cached: go straight to loaded (skip shimmer/opacity dip)
            if (!cancelled) setLoaded(true);
            return () => {
                cancelled = true;
            };
        }

        // not cached: show shimmer until it loads
        setLoaded(false);

        return () => {
            cancelled = true;
        };
    }, [src]);

    // ✅ When the DOM img is already complete (some browsers), sync loaded
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        if (img.complete && img.naturalWidth > 0) {
            setLoaded(true);
        }
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
