import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useAuth } from "../../hooks/useAuth"
import { AxiosResponse } from "axios"
import { ToastContainer } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import { OrbitProgress } from "react-loading-indicators"
import Crossmark from "../../components/animations/crossmark"

export default function ResetPassword() {
    const searchParams = useSearchParams()
    const token = searchParams[0].get('token')
    const { handleVerifyResetPasswordToken, handleResetPassword } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState<AxiosResponse>()
    const [time, setTime] = useState(0)
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
        match: false,
    });
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const verifyToken = async (token: string) => {
            if (token && token.length === 64) {
                const res = await handleVerifyResetPasswordToken(token)
                setIsLoading(false)
                setResponse(res)

                if (res && res.status !== 200) {
                    setTime(5)
                }                
            }
            else {
                navigate('/login')
            }
        }

        verifyToken(token)
    }, [token])

    useEffect(() => {
        if (time <= 0) return

        const interval = setInterval(() => {
            setTime((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [time])

    useEffect(() => {
        if ((!isLoading && time === 0 && response && response.status !== 200)) {
            navigate('/login')
        }
    }, [time, isLoading, response])

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        handleResetPassword(token, password, confirmPassword, navigate)
    }

    return (
        <div className="flex h-full min-h-min min-w-min flex-col justify-center px-6 lg:px-8">
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            {isLoading ?
            (
                <div className="flex h-full items-center justify-center">
                    <OrbitProgress color="#2563eb" size="medium" text="" textColor="" />
                </div>
            ) :
                (response.status === 200 ? 
                (
                    <>
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                                Reset your password
                            </h2>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>  
                    </>
                ) :
                (
                    <div className="flex flex-col items-center justify-center gap-5">
                        <Crossmark />
                        {response.data.error}
                        <Link to="/login">Redirecting in {time}s</Link>
                    </div>
                ))
            }
        </div>
    )
}