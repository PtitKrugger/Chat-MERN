import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import IconGenderMale from "../../components/svg/genderMale";
import IconGenderFemale from "../../components/svg/genderFemale";
import GenderInput from "../../components/inputs/GenderInput";
import { useAuth } from "../../hooks/useAuth";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
        match: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [genderValue, setGenderValue] = useState("");
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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

    const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        setPassword(inputValue);

        setPasswordRequirements((prev) => ({
            ...prev,
            length: inputValue.length >= 12,
            upper: /[A-Z]/.test(inputValue),
            lower: /[a-z]/.test(inputValue),
            number: /\d/.test(inputValue),
            special: /[^A-Za-z0-9]/.test(inputValue),
        }));
    };

    const handleConfirmPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        setConfirmPassword(inputValue);

        setPasswordRequirements((prev) => ({
            ...prev,
            match: password === inputValue,
        }));
    };

    return (
        <>
            <div className="flex h-full min-h-min min-w-min flex-col justify-center px-6 lg:px-8">
                <ToastContainer
                    position="top-center"
                    toastClassName="text-black"
                    aria-label=""
                />
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Register
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="flex text-sm/6 font-medium text-gray-900"
                            >
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={30}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onInput={(e) =>
                                        setUsername((e.target as HTMLInputElement).value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="flex text-sm/6 font-medium text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    minLength={6}
                                    maxLength={254}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onInput={(e) =>
                                        setEmail((e.target as HTMLInputElement).value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm/6">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        onInput={handlePasswordChange}
                                        minLength={12}
                                        maxLength={64}
                                        className="m-0 w-full border-none p-0 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0" // <-- rempli le div
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    The password must contain at least:
                                    <ul className="text-sm">
                                        <li
                                            className={
                                                passwordRequirements.length
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.length ? "✔" : "✖"} 12 characters
                                        </li>
                                        <li
                                            className={
                                                passwordRequirements.upper
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.upper ? "✔" : "✖"} one uppercase
                                        </li>
                                        <li
                                            className={
                                                passwordRequirements.lower
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.lower ? "✔" : "✖"} one lowercase
                                        </li>
                                        <li
                                            className={
                                                passwordRequirements.number
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.number ? "✔" : "✖"} one number
                                        </li>
                                        <li
                                            className={
                                                passwordRequirements.special
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.special ? "✔" : "✖"} one special
                                            character
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm/6">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-confirm-password"
                                        minLength={12}
                                        maxLength={64}
                                        onInput={handleConfirmPasswordChange}
                                        className="m-0 w-full border-none p-0 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0" // <-- rempli le div
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <ul className="text-sm">
                                    {confirmPassword !== "" && (
                                        <li
                                            className={
                                                passwordRequirements.match
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {passwordRequirements.match
                                                ? "✔ Passwords match"
                                                : "✖ Passwords don't match"}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="Gender"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Gender
                                </label>
                            </div>
                            <div className="mt-2">
                                <GenderInput
                                    maleSvg={
                                        <IconGenderMale
                                            currentColor="#2563eb"
                                            height="32px"
                                            width="32px"
                                        />
                                    }
                                    femaleSvg={
                                        <IconGenderFemale
                                            currentColor="#ec4899"
                                            height="32px"
                                            width="32px"
                                        />
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
