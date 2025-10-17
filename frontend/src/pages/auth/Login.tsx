import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { useNavigate } from "react-router";

import { useAuth } from "../../hooks/useAuth";
import type { redirectToastMessage } from "../../types/redirectToastMessage"
import EmailInput from "../../components/inputs/EmailInput";
import PasswordInput from "../../components/inputs/PasswordInput";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    // If there was a redirect message from a request
    const location = useLocation();
    const state = location.state as redirectToastMessage | undefined;

    useEffect(() => {
        if (state?.showToast) {
            toast.success(state.message, {
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
                transition: Zoom,
            });
        }        
    }, [state])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if ((email !== "" || email.length >= 6) /*&& (password !== "" && password.length >= 12)*/) {
            handleLogin(email, password, navigate);
        }
    };

    return (
        <div className="flex h-full">
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            <div className="flex min-h-min min-w-min flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Log in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="flex text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <EmailInput email={email} setEmail={setEmail} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <PasswordInput password={password} setPassword={setPassword} />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Log in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        No account ?&nbsp;
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                    <p className="mt-3 text-center text-sm/6 text-gray-500">
                        Forgot your password ?&nbsp;
                        <Link
                            to="/forgot-password"
                            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Reset your password
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
