import axios from "axios";
import { toast, Zoom } from "react-toastify";
import { AxiosResponse } from "axios";

type AuthResponse = {
    isLoggedIn: boolean;
    response?: AxiosResponse;
};

export const useAuth = () => {
    async function handleRegister(
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
        genderValue: string,
        navigate: (path: string) => void,
    ) {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password,
                    confirmPassword,
                    gender: genderValue,
                },
            );

            if (response.status === 201) {
                navigate("/login");

                toast.success("Account was successfully created", {
                    position: "top-center",
                    pauseOnHover: true,
                    draggable: true,
                    transition: Zoom,
                });
            }
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });
        }
    }

    async function handleLogin(email: string, password: string, navigate: (path: string) => void) {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 200) {
                navigate("/");
            }
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });
        }
    }

    async function handleLogout(navigate: (path: string) => void) {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                {
                    withCredentials: true,
                },
            );

            if (response.status === 200) {
                toast.success("You have successfully logged out.");
            }
        } catch (e: any) {
            // Si erreur 401, ex: utilisateur n'est pas connecté et veut se déconnecter
            toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`,
            );
        } finally {
            navigate("/login");
        }
    }

    async function checkAuth(): Promise<AuthResponse> {
        let isLoggedIn = false;

        try {
            const response = await axios.get("http://localhost:5000/api/auth/check", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                isLoggedIn = true;
            }

            return isLoggedIn ? { isLoggedIn, response } : { isLoggedIn };
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });

            return { isLoggedIn: false };
        }
    }

    return { handleRegister, handleLogin, handleLogout, checkAuth };
};
