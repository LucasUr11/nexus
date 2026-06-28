import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // Si no esta autenticado, se rederidige al login.-
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Si se esta autenticado, se renderiza el Admin.-
    return <Outlet />;
}