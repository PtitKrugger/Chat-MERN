import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators"
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { AxiosResponse } from "axios";
import Checkmark from "../../components/animations/Checkmark";
import Crossmark from "../../components/animations/Crossmark";

import { ToastContainer } from "react-toastify";
import ResendEmailDialog from "../../components/dialog/ResendEmailDialog";

type Status = "Idle" | "Loading" | "Success" | "Error"

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const token = searchParams[0].get('token')
    
    const { handleVerifyEmail, handleResendVerificationEmail } = useAuth()
    const [status, setStatus] = useState<Status>("Loading")
    const [response, setResponse] = useState<AxiosResponse>()

    const [time, setTime] = useState(0)
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [email, setEmail] = useState("")

    useEffect(() => {
        const fetchVerification = async () => {
            if (token && token.length === 64) {
                const res = await handleVerifyEmail(token)
                setResponse(res)

                if (res?.status === 200) {
                    setStatus("Success")
                    setTime(5)
                } else {
                    setStatus("Error")
                }
            } else {
                setStatus("Idle")
            }
        }

        fetchVerification()
    }, [token])

    useEffect(() => {
        if (time > 0) {
            const interval = setInterval(() => setTime((prev) => prev - 1), 1000)
            return () => clearInterval(interval)
        }
        if (time === 0 && status === "Success") {
            navigate("/login")
        }
    }, [time, status, navigate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email.trim().length > 0) {
            handleResendVerificationEmail(email.trim())
        }
    }

    if (status === "Loading") {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                <OrbitProgress color="#2563eb" size="medium" text="" textColor="" />
            </div>
        )
    }

    if (status === "Success" && response) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                <div className="flex flex-col items-center justify-center gap-5">
                    <Checkmark />
                    {response.data.message}
                    <Link to="/login">Redirecting in {time}s</Link>
                </div>
            </div>
        )
    }

    if (status === "Error" && response) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                <div className="flex flex-col items-center justify-center gap-5">
                    <Crossmark />
                    {response.data.error}
                    <ResendEmailDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        onSubmit={handleSubmit}
                        setEmail={setEmail}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full flex justify-center items-center">
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            <ResendEmailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                setEmail={setEmail}
            />
        </div>
    )

}