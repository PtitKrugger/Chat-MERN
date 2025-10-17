import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ToastContainer, toast, Zoom } from "react-toastify";

import IconGenderMale from "../../components/svg/GenderMale";
import IconGenderFemale from "../../components/svg/GenderFemale";
import GenderInput from "../../components/inputs/GenderInput";
import { useAuth } from "../../hooks/useAuth";
import PasswordFormGroup from "../../components/inputs/PasswordFormGroup";
import EmailInput from "../../components/inputs/EmailInput";
import UsernameInput from "../../components/inputs/UsernameInput";

export default function Signup() {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [genderValue, setGenderValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (username.trim().length > 0 && email.trim().length > 0 && genderValue.length > 0) {
            handleRegister(
                username,
                email,
                password,
                confirmPassword,
                genderValue,
                navigate,
            );
        } 
        else if (password !== confirmPassword) {
            toast.error(`Password doesn't matches`, {
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Zoom,
            });
        } 
        else {
            toast.error(`Please fill in all the fields`, {
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Zoom,
            });
        }
    };

    return (
        <>
            <div className="flex h-full min-h-min min-w-min flex-col justify-center px-6 lg:px-8">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Register
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="username" className="flex text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <UsernameInput setUsername={setUsername} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="flex text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <EmailInput setEmail={setEmail} />
                            </div>
                        </div>

                        <PasswordFormGroup password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="Gender" className="block text-sm/6 font-medium text-gray-900">
                                    Gender
                                </label>
                            </div>
                            <div className="mt-2">
                                <GenderInput
                                    maleSvg={
                                        <IconGenderMale />
                                    }
                                    femaleSvg={
                                        <IconGenderFemale />
                                    }
                                    value={genderValue}
                                    onChange={(gender) => setGenderValue(gender)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm/6 text-gray-500">
                        Already have an account ?&nbsp;
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-500"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
