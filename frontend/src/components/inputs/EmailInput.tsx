import React from "react";

type EmailInputProps = {
    email: string
    setEmail: (e: string) => void
}

export default function EmailInput({ email, setEmail }: EmailInputProps) {
    return (
        <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            minLength={6}
            maxLength={254}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            value={email}
            onInput={(e) =>
                setEmail((e.target as HTMLInputElement).value)
            }
        />
    )
}