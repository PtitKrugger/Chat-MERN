import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { AxiosResponse } from "axios";
import Checkmark from "../../components/animations/checkmark";
import Crossmark from "../../components/animations/crossmark";

import * as Dialog from "@radix-ui/react-dialog"
import { ToastContainer } from "react-toastify";

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const token = searchParams[0].get('token')
    const { handleVerifyEmail, handleResendVerificationEmail } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState<AxiosResponse>()
    const [time, setTime] = useState(0)
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [email, setEmail] = useState("")

    useEffect(() => {
        const VerifyEmail = async () => {
            if (token && token.length === 64) {
                const res = await handleVerifyEmail(token)
                setResponse(res)
                setIsLoading(false)
                console.log(res)

                if (res && res.status === 200) {
                    setTime(5)
                }
            }
            else {
                setIsLoading(false)
            }
        }

        VerifyEmail()
    }, [token])

    useEffect(() => {
        if (time <= 0) return

        const interval = setInterval(() => {
            setTime((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [time])

    useEffect(() => {
        if (!isLoading && time === 0 && response && response.status === 200) {
            navigate('/login')
        }
    }, [time, isLoading, response])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail((prevEmail) => prevEmail.trim())

        if (email.trim().length > 0) {
            handleResendVerificationEmail(email)
        }
    }

    return (
        <div className="h-full w-full flex justify-center items-center">
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            {isLoading ?
                (<OrbitProgress color="#2563eb" size="medium" text="" textColor="" />)
                :
                (response !== undefined ?
                    (response.status === 200 ?
                        (
                            <div className="flex flex-col items-center justify-center gap-5">
                                <Checkmark />
                                {response.data.message}
                                <Link to="/login">Redirecting in {time}s</Link>
                            </div>
                        )
                        :
                        (
                            <div className="flex flex-col items-center justify-center gap-5">
                                <Crossmark />
                                {response.data.error}

                                <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <Dialog.Trigger asChild>
                                        <span
                                            className="cursor-pointer text-blue-600 hover:text-blue-800 underline"
                                            onClick={() => setDialogOpen(true)}>
                                            Click here to resend a verification email
                                        </span>
                                    </Dialog.Trigger>

                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide" />
                                        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide">
                                            <Dialog.Title className="text-lg font-bold">Resend verification email</Dialog.Title>
                                            <Dialog.Description className="mt-2 text-sm">
                                                Please enter your email address and we’ll send you a new verification link.
                                            </Dialog.Description>

                                            <form onSubmit={handleSubmit} method="POST">
                                                <input className="w-full mt-4 border p-2 rounded"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    minLength={6}
                                                    maxLength={254}
                                                    placeholder="Email address"
                                                    onInput={(e) =>
                                                        setEmail((e.target as HTMLInputElement).value)
                                                    }
                                                />

                                                <div className="mt-4 flex justify-end gap-2">
                                                    <Dialog.Close asChild>
                                                        <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                                    </Dialog.Close>
                                                    <Dialog.Close asChild>
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Resend email</button>
                                                    </Dialog.Close>
                                                </div>
                                            </form>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        )
                    )
                    :
                    <div className="flex flex-col items-center justify-center gap-5">
                        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                            <Dialog.Trigger asChild>
                                <span
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 underline"
                                    onClick={() => setDialogOpen(true)}>
                                    Need another verification email ? Click here
                                </span>
                            </Dialog.Trigger>

                            <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide" />
                                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide">
                                    <Dialog.Title className="text-lg font-bold">Resend verification email</Dialog.Title>
                                    <Dialog.Description className="mt-2 text-sm">
                                        Please enter your email address and we’ll send you a new verification link.
                                    </Dialog.Description>

                                    <form onSubmit={handleSubmit} method="POST">
                                        <input className="w-full mt-4 border p-2 rounded"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            minLength={6}
                                            maxLength={254}
                                            placeholder="Email address"
                                            onInput={(e) =>
                                                setEmail((e.target as HTMLInputElement).value)
                                            }
                                        />

                                        <div className="mt-4 flex justify-end gap-2">
                                            <Dialog.Close asChild>
                                                <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                            </Dialog.Close>
                                            <Dialog.Close asChild>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Resend email</button>
                                            </Dialog.Close>
                                        </div>
                                    </form>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>
                )
            }
        </div>
    )
}