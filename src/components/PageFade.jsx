import { useLocation } from "react-router-dom";

export default function PageFade({ children }) {
    const location = useLocation();

    return (
        <div key={location.pathname} className="page page-in">
            {children}
        </div>
    );
}
