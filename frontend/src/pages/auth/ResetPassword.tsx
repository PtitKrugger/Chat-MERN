import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useAuth } from "../../hooks/useAuth"
import { AxiosResponse } from "axios"
import { ToastContainer } from "react-toastify"
import { OrbitProgress } from "react-loading-indicators"
import Crossmark from "../../components/animations/Crossmark"
import PasswordFormGroup from "../../components/inputs/PasswordFormGroup"

type Status = "Loading" | "Success" | "Error"

export default function ResetPassword() {
    const searchParams = useSearchParams()
    const token = searchParams[0].get('token')

    const { handleVerifyResetPasswordToken, handleResetPassword } = useAuth()
    const [status, setStatus] = useState<Status>("Loading")
    const [response, setResponse] = useState<AxiosResponse>()

    const [time, setTime] = useState(0)
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const verifyToken = async (token: string) => {
            if (token && token.length === 64) {
                const res = await handleVerifyResetPasswordToken(token)
                setResponse(res)

                if (res?.status === 200) {
                    setStatus("Success")
                } else {
                    setStatus("Error")
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
        if (status === "Error" && time === 0) {
            navigate('/login')
        }
    }, [time, status, response])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleResetPassword(token, password, confirmPassword, navigate)
    }

    if (status === "Loading") {
        return (
            <div className="flex h-full min-h-min min-w-min flex-col justify-center px-6 lg:px-8">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                <div className="flex h-full items-center justify-center">
                    <OrbitProgress color="#2563eb" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }

    if (status === "Error") {
        return (
            <div className="flex flex-col items-center justify-center gap-5">
                <Crossmark />
                {response.data.error}
                <Link to="/login">Redirecting in {time}s</Link>
            </div>            
        )
    }

    if (status === "Success") {
        return (
            <div className="flex h-full min-h-min min-w-min flex-col justify-center px-6 lg:px-8">
                <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Reset your password
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <PasswordFormGroup password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
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
            </div>
        )        
    }

}