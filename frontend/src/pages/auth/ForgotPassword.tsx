import React, { useState } from "react"
import { ToastContainer } from "react-toastify"
import { useAuth } from "../../hooks/useAuth"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const { handleForgotPassword } = useAuth()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleForgotPassword(email)
    }

    return (
        <div className="flex h-full">
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            <div className="flex min-h-min min-w-min flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Forgot password
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Send reset link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}