import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const base = import.meta.env.BASE_URL;
    const [open, setOpen] = useState(false);
    const burgerBtnRef = useRef(null);


    // swipe state
    const drawerRef = useRef(null);
    const dragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        shiftX: 0,
        width: 0,
        horizontal: false,
    });
    const [shiftX, setShiftX] = useState(0);
    const [dragging, setDragging] = useState(false);

    const close = () => {
        setOpen(false);
        requestAnimationFrame(() => burgerBtnRef.current?.focus());
    };

    // Close on ESC
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Auto-close drawer when switching to desktop width
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 641px)");
        const handle = () => {
            if (mq.matches) setOpen(false);
        };
        handle();
        mq.addEventListener("change", handle);
        return () => mq.removeEventListener("change", handle);
    }, []);

    // Reset drag when closing
    useEffect(() => {
        if (!open) {
            setShiftX(0);
            setDragging(false);
            dragRef.current.active = false;
        }
    }, [open]);

    function onDrawerPointerDown(e) {
        if (!open) return;

        // Only left button for mouse; touch/pen ok
        if (e.pointerType === "mouse" && e.button !== 0) return;

        const width = drawerRef.current?.offsetWidth || 320;

        dragRef.current = {
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            shiftX: 0,
            width,
            horizontal: false,
        };

        setDragging(true);

        // capture pointer so move/up still fire even if finger leaves drawer
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch { }
    }

    function onDrawerPointerMove(e) {
        const s = dragRef.current;
        if (!s.active) return;

        const dx = e.clientX - s.startX;
        const dy = e.clientY - s.startY;

        // Decide if user is swiping horizontally (not scrolling)
        if (!s.horizontal) {
            if (Math.abs(dx) > Math.abs(dy) + 8) s.horizontal = true;
            else return; // treat as normal scroll/gesture
        }

        // Closing swipe = drag RIGHT (positive dx)
        const clamped = Math.max(0, Math.min(dx, s.width));
        s.shiftX = clamped;
        setShiftX(clamped);

        // prevent page scrolling while doing horizontal swipe
        e.preventDefault?.();
    }

    function onDrawerPointerUp(e) {
        const s = dragRef.current;
        if (!s.active) return;

        s.active = false;
        setDragging(false);

        const threshold = s.width * 0.28; // 28% swipe closes
        if (s.shiftX > threshold) {
            setShiftX(0);
            close();
        } else {
            // snap back open
            setShiftX(0);
        }

        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch { }
    }

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <NavLink to="/" className="brand" onClick={close} aria-label="Go to home">
                    <picture>
                        <source srcSet={`${base}logo-mark-dark.png`} media="(prefers-color-scheme: dark)" />
                        <source srcSet={`${base}logo-mark-light.png`} media="(prefers-color-scheme: light)" />
                        <img src={`${base}logo-mark-dark.png`} alt="Silly Slice logo" className="brand-mark" />
                    </picture>
                    <strong className="brand-name">Silly Slice</strong>
                </NavLink>

                {/* Desktop nav */}
                <nav className="nav nav--desktop">
                    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Home
                    </NavLink>
                    <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Shop
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Contact
                    </NavLink>
                </nav>

                {/* Mobile hamburger */}
                <button
                    ref={burgerBtnRef}
                    className="nav-toggle"
                    type="button"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </span>
                </button>
            </div>

            {/* Drawer Layer */}
            <div className={`drawer-layer ${open ? "is-open" : ""}`} hidden={!open}>

                {/* Tap outside closes */}
                <button
                    type="button"
                    className={`drawer-overlay ${open ? "is-open" : ""}`}
                    onClick={close}
                    aria-label="Close menu"
                />

                {/* Drawer (swipe right to close) */}
                <aside
                    ref={drawerRef}
                    className={`drawer ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""}`}
                    aria-label="Mobile navigation"
                    style={open && shiftX ? { transform: `translate3d(${shiftX}px, 0, 0)` } : undefined}
                    onPointerDown={onDrawerPointerDown}
                    onPointerMove={onDrawerPointerMove}
                    onPointerUp={onDrawerPointerUp}
                    onPointerCancel={onDrawerPointerUp}
                >
                    <div className="drawer-top">
                        <strong className="drawer-title">Menu</strong>
                        <button className="drawer-close" type="button" onClick={close} aria-label="Close menu">
                            ✕
                        </button>
                    </div>

                    <nav className="drawer-links">
                        <NavLink to="/" end onClick={close} className="drawer-link">
                            Home
                        </NavLink>
                        <NavLink to="/shop" onClick={close} className="drawer-link">
                            Shop
                        </NavLink>
                        <NavLink to="/about" onClick={close} className="drawer-link">
                            About
                        </NavLink>
                        <NavLink to="/contact" onClick={close} className="drawer-link">
                            Contact
                        </NavLink>
                    </nav>

                    <div className="drawer-cta">
                        <NavLink to="/contact" onClick={close} className="btn">
                            Custom request
                        </NavLink>
                    </div>
                </aside>
            </div>
        </header>
    );
}
