import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
    children: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, token, loadingUser } = useUser();
    const location = useLocation();

    if (loadingUser) {
        // Wait until user is loaded
        return <div>Loading...</div>; // or a spinner
    }

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
