import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function RequireAuth({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div style={{ padding: 24 }}>Checking access…</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
