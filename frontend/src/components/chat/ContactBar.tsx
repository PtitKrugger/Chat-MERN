import React from "react";
import { User } from "../../types/user";

type ContactBarProps = {
    users: Array<User>;
    selectedUser: User | undefined;
    emitSelectedUserChange: (userId: string) => void;
};

export default function ContactBar({ users, selectedUser, emitSelectedUserChange }: ContactBarProps) {
    const userStatuses = [
        { value: "Online", textColor: "text-green-600", bgColor: "bg-green-500" },
        { value: "Away", textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
        { value: "Busy", textColor: "text-red-500", bgColor: "bg-red-500" }
    ];

    return (
        <>
            <div className="h-[86%] w-full overflow-auto [direction:rtl]">
                {users ? (
                    users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => emitSelectedUserChange(user._id)}
                            className={`flex cursor-pointer items-center gap-4 border-b p-4 ${selectedUser !== undefined ? (selectedUser._id === user._id ? "bg-gray-100" : "") : ""} transition-colors duration-200 ease-in-out [direction:ltr] hover:bg-gray-100`}
                        >
                            <img
                                src={user.pfp}
                                className="h-14 w-14 rounded-full border border-black"
                            />
                            <div className="flex flex-col">
                                <span className="text-slate-900">{user.username}</span>
                                {user.isOnline ? (
                                    <span className={`text-sm font-medium ${userStatuses.find((status) => status.value === user.status)['textColor']}`}>
                                        {user.status}
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-slate-500">
                                        Offline
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
}
