import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
    const { checkAuth } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null); 

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus["isLoggedIn"]);
        };
        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
