import React from "react";

type PasswordInputProps = {
    password: string
    setPassword: (p: string) => void
}

export default function PasswordInput({ password, setPassword }: PasswordInputProps) {
    return (
        <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            /*minLength={12}*/
            maxLength={64}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            value={password}
            onInput={(e) =>
                setPassword((e.target as HTMLInputElement).value)
            }
        />
    )
}