import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type PasswordFormGroupProps = {
    password: string,
    setPassword: (p: string) => void,
    confirmPassword: string,
    setConfirmPassword: (cp: string) => void
}

export default function PasswordFormGroup({ password, setPassword, confirmPassword, setConfirmPassword }: PasswordFormGroupProps) {
    const [showPassword, setShowPassword] = useState(false)

    const passwordRequirements = {
        length: password.length >= 12,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        match: password === confirmPassword
    }

    return (
        <>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                    </label>
                </div>
                <div className="relative block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm/6">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
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
                        <Requirement ok={passwordRequirements.length} label="12 characters" />
                        <Requirement ok={passwordRequirements.upper} label="one uppercase" />
                        <Requirement ok={passwordRequirements.lower} label="one lowercase" />
                        <Requirement ok={passwordRequirements.number} label="one number" />
                        <Requirement ok={passwordRequirements.special} label="one special character" />
                    </ul>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
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
                            onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                            className="m-0 w-full border-none p-0 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
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
                        {confirmPassword !== "" && <Requirement ok={passwordRequirements.match} label="Passwords match" />}
                    </ul>
                </div>
            </div>
        </>
    )
}

function Requirement({ ok, label }: { ok: boolean; label: string }) {
    return (
        <li className={ok ? "text-green-600" : "text-red-600"}>
            {ok ? "✔" : "✖"} {label}
        </li>
    )
}