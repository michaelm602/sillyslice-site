import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const ADMIN_EMAILS = new Set([
    "michaelm602@yahoo.com",
    "sillyslice7@gmail.com",
]);

export default function RequireAuth({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div style={{ padding: 24 }}>Checking access…</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const email = (user.email || "").toLowerCase();
    const isAdmin = ADMIN_EMAILS.has(email);

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
