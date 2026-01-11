// src/components/Lightbox.jsx
import { useEffect, useMemo, useRef } from "react";
import SafeImage from "./SafeImage";

export default function Lightbox({
    open,
    images = [],
    index = 0,
    onClose,
    onPrev,
    onNext,
}) {
    const hasImages = images && images.length > 0;

    const src = useMemo(() => {
        if (!hasImages) return "";
        const i = Math.max(0, Math.min(index, images.length - 1));
        return images[i];
    }, [images, index, hasImages]);

    // Keyboard: ESC closes, arrows navigate
    useEffect(() => {
        if (!open) return;

        function onKey(e) {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowLeft") onPrev?.();
            if (e.key === "ArrowRight") onNext?.();
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose, onPrev, onNext]);

    // Prevent background scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Swipe support (mobile)
    const startX = useRef(null);
    const startY = useRef(null);

    function onTouchStart(e) {
        const t = e.touches?.[0];
        if (!t) return;
        startX.current = t.clientX;
        startY.current = t.clientY;
    }

    function onTouchEnd(e) {
        const t = e.changedTouches?.[0];
        if (!t) return;

        const dx = t.clientX - (startX.current ?? t.clientX);
        const dy = t.clientY - (startY.current ?? t.clientY);

        // only treat as swipe if mostly horizontal
        if (Math.abs(dx) < 50) return;
        if (Math.abs(dy) > Math.abs(dx) * 0.6) return;

        if (dx > 0) onPrev?.();
        else onNext?.();
    }

    if (!open) return null;

    return (
        <div
            className="lb-overlay"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
                // click outside closes
                if (e.target === e.currentTarget) onClose?.();
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="lb-shell">
                <button className="lb-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <button className="lb-nav lb-prev" onClick={onPrev} aria-label="Previous">
                    ‹
                </button>

                <div className="lb-stage">
                    <SafeImage className="lb-img" src={src} fallbackSrc={src} alt="" />
                </div>

                <button className="lb-nav lb-next" onClick={onNext} aria-label="Next">
                    ›
                </button>

                <div className="lb-hint">Swipe or use arrow keys</div>
            </div>
        </div>
    );
}
