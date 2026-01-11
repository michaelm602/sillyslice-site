// src/components/Lightbox.jsx
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

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

        if (Math.abs(dx) < 50) return;
        if (Math.abs(dy) > Math.abs(dx) * 0.6) return;

        if (dx > 0) onPrev?.();
        else onNext?.();
    }

    if (!open) return null;

    const modal = (
        <div
            className="lb-overlay"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
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

    // ✅ This avoids "fixed inside transformed parent" nonsense
    return createPortal(modal, document.body);
}
