import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { User } from "../../types/user"

type UserPanelProps = {
    currentUser: User,
    emitStatusChange: (newStatus: string) => void 
}

type UserStatus = {
    value: string,
    textColor: string,
    bgColor: string
}

export default function UserPanel({ currentUser, emitStatusChange }: UserPanelProps) {
    const [arrowOpen, setArrowOpen] = useState<boolean>(false)
    const statuses = [
        { value: "Online", textColor: "text-green-600", bgColor: "bg-green-500" },
        { value: "Away", textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
        { value: "Busy", textColor: "text-red-500", bgColor: "bg-red-500" },
    ];
    const [userStatus, setUserStatus] = useState<UserStatus>(statuses[0])

    const handleUserStatusChange = (newStatus: UserStatus) => {
        setUserStatus(newStatus)
        setArrowOpen(!open)
        emitStatusChange(newStatus.value)
    }

    function ArrowToggle({open, setOpen}: {open: boolean, setOpen: (v: boolean) => void}) {
        return (
            <div className="relative">
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        className="inline-flex items-center p-1 rounded focus:outline-none"
                        >
                        {/* Triangle */}
                        <span
                            className={`inline-block h-0 w-0 cursor-pointer
                            border-b-4 border-l-4 border-r-4 border-b-black border-l-transparent border-r-transparent
                            transform transition-transform duration-300 ease-in-out
                            ${open ? "rotate-180" : "rotate-0"}`}
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute mt-1 w-fit rounded-xl bg-white shadow-md"
                        >
                            {statuses.map((status) => (
                                <div key={status.value} onClick={() => handleUserStatusChange(status)} className={`flex items-center w-full space-x-2 p-2 ${userStatus.value === status.value ? "bg-gray-100" : "bg-white cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"}`}>
                                    <span className={`w-2 h-2 rounded-full ${status.bgColor}`}/>
                                    <span className={`${status.textColor}`}>{status.value}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="flex h-[14%] w-full items-center gap-4 border-b bg-white p-4">
            <img
                src={currentUser !== undefined ? currentUser.pfp : ''}
                className="h-14 w-14 rounded-full border border-black"
            />
            <div className="flex flex-col">
                <strong className="text-lg font-medium text-slate-900">
                    {currentUser?.username || '...'}
                </strong>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${userStatus.textColor}`}>
                    {userStatus.value}
                    <ArrowToggle open={arrowOpen} setOpen={setArrowOpen} />
                </span>
            </div>
        </div>
    )
}