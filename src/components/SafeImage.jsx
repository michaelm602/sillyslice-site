import { useEffect, useRef, useState } from "react";

function resolvePublic(u) {
    if (!u) return u;

    // If it's an absolute URL (http, https, blob, data), leave it alone
    if (/^(https?:|blob:|data:)/i.test(u)) return u;

    // If it starts with "/", it's a root path. On GH Pages that breaks.
    // Convert "/x.jpg" -> `${BASE_URL}x.jpg`
    if (u.startsWith("/")) {
        const base = import.meta.env.BASE_URL || "/";
        return `${base}${u.slice(1)}`;
    }

    // "placeholder.jpg" (relative) is fine as-is
    return u;
}

export default function SafeImage({
    src,
    alt = "",
    fallbackSrc,
    className = "",
    ...props
}) {
    const imgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(resolvePublic(src));

    // ✅ Smart src change: if cached, mark loaded immediately (no flicker)
    useEffect(() => {
        if (!src) return;

        const resolved = resolvePublic(src);

        // If it's the same src, don't thrash state
        setCurrentSrc((prev) => (prev === resolved ? prev : resolved));

        let cancelled = false;

        const probe = new Image();
        probe.src = resolved;

        if (probe.complete && probe.naturalWidth > 0) {
            if (!cancelled) setLoaded(true);
            return () => {
                cancelled = true;
            };
        }

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
                const resolvedFallback = resolvePublic(fallbackSrc);

                if (resolvedFallback && currentSrc !== resolvedFallback) {
                    setCurrentSrc(resolvedFallback);
                }
            }}
            {...props}
        />
    );
}
