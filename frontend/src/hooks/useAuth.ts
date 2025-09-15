import axios, { Axios, HttpStatusCode, ResponseType } from "axios";
import { toast, Zoom } from "react-toastify";
import { AxiosResponse } from "axios";
import type { redirectToastMessage } from "../types/redirectToastMessage"

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
        navigate: (path: string, options?: { state?: redirectToastMessage }) => void,
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
                navigate("/login", { state: { showToast: true, message: 'We’ve sent you a verification email. Please check your inbox to verify your account.' } });
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

            if (e.response.status === 403) {
                if (e.response.data.errorType === 'emailNotVerified') {
                    navigate("/verify-email")
                }
            }
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
            toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`,
            );
        } finally {
            navigate("/login");
        }
    }

    async function handleVerifyEmail(token: string): Promise<AxiosResponse> {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/verify-email?token=${token}`
            )

            return response;
        } 
        catch (e: any) {
            /*toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`
            )*/

            return e.response;
        }
    }

    async function handleResendVerificationEmail(email: string) {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/auth/verify-email/resend`,
                {
                    email
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)
            }
        }
        catch (e: any) {
            toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`
            );
        }
    }

    async function handleForgotPassword(email: string) {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/auth/forgot-password`,
                {
                    email
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)
            }
        }
        catch (e: any) {
            toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`
            )
        }
    }

    async function handleVerifyResetPasswordToken(token: string): Promise<AxiosResponse> {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/reset-password?token=${token}`
            )
            return response;
        } 
        catch (e: any) {
            /*toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`
            )*/
            return e.response;
        }
    }

    async function handleResetPassword(token: string, password: string, confirmPassword: string, navigate: (path: string, options?: { state?: redirectToastMessage }) => void,) {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/auth/reset-password`,
                {
                    token, password, confirmPassword
                }
            )

            if (response.status === 200) {
                navigate("/login", { state: { showToast: true, message: response.data.message } });
            }
        }
        catch (e: any) {
            toast.error(
                `An error has occurred: ${e.response?.data?.error || e.message}`
            )
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

    return { handleRegister, handleLogin, handleLogout, handleVerifyEmail, handleResendVerificationEmail, handleForgotPassword, handleVerifyResetPasswordToken, handleResetPassword,checkAuth };
};
