import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface PublicRouteProps {
    children: any;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, token } = useUser();

    // If already logged in, redirect to home
    if (user && token) {
        return <Navigate to="/" replace />;
    }

    return children;
};
