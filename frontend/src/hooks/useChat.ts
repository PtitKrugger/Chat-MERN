import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Zoom } from "react-toastify";
import { User } from "../types/user";

type onlineUsers = {
    userId: string,
    status: string
}

export const useChat = () => {
    const [users, setUsers] = useState<Array<User>>([]);
    const [onlineUsers, setOnlineUsers] = useState<Array<onlineUsers>>([]);
    const [usersLoaded, setUsersLoaded] = useState(false);

    useEffect(() => {
        if (!usersLoaded || onlineUsers.length === 0) return;

        setUsers((prevUsers) =>
            prevUsers
                .map((user) => ({
                    ...user,
                    isOnline: onlineUsers.some((onlineUser) => onlineUser.userId === user._id),
                    status: onlineUsers.some((onlineUser) => user._id === onlineUser.userId) ? onlineUsers.find((onlineUser) => onlineUser.userId === user._id)['status'] : ""
                }))
                .sort((a, b) => {
                    // Sort users by online status
                    return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
                }),
        );
    }, [usersLoaded, onlineUsers]);

    async function getAllUsers() {
        try {
            const response = await axios.get("http://localhost:5000/api/users/", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const updatedUsers = response.data.map((user: User) => ({
                    ...user,
                    isOnline: false,
                }));
                setUsers(updatedUsers);
                setUsersLoaded(true);
            }
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });
        }
    }

    async function getConversation(userToChatId: string) {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/messages/${userToChatId}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 200) {
                return response;
            }
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });
        }
    }

    async function sendNewMessage(userToChatId: string, newMessage: string) {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/messages/send/${userToChatId}`,
                {
                    message: newMessage,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 201) {
                return response;
            }
        } catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom,
            });
        }
    }

    return {
        getAllUsers,
        setOnlineUsers,
        getConversation,
        sendNewMessage,
        users
    };
};
