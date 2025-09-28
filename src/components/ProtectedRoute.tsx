import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
    children: any;
}

// Redirects to /login if user is not logged in
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, token } = useUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
