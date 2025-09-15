import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Logout() {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        handleLogout(navigate);
    }, []);

    return (
        <>
            <h1>Logging out...</h1>
        </>
    );
}
