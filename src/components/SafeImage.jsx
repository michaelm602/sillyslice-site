import { useEffect, useRef, useState } from "react";

function resolvePublic(u) {
    if (!u) return u;
    if (/^(https?:|blob:|data:)/i.test(u)) return u;

    const base = import.meta.env.BASE_URL || "/";

    if (u.startsWith(base)) return u;
    if (u.startsWith("/")) return `${base}${u.slice(1)}`;

    return `${base}${u}`;
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

    // 🔄 Handle src changes (cached images skip shimmer)
    useEffect(() => {
        if (!src) return;

        const resolved = resolvePublic(src);

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

    // 🔁 Sync if browser already has it
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
