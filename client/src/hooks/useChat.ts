import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Zoom } from "react-toastify";
import { User } from "../types/user";

export const useChat = () => {
    const [users, setUsers] = useState<Array<User>>([]);
    const [onlineUserIds, setOnlineUserIds] = useState<Array<string>>([]);
    const [usersLoaded, setUsersLoaded] = useState(false);

    useEffect(() => {
        if (!usersLoaded || onlineUserIds.length === 0) return;

        setUsers((prevUsers) =>
            prevUsers
                .map((user) => ({
                    ...user,
                    isOnline: onlineUserIds.includes(user._id),
                }))
                .sort((a, b) => {
                    // Trier en ligne (true) en haut
                    return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
                }),
        );
    }, [usersLoaded, onlineUserIds]);

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
        setOnlineUserIds,
        onlineUserIds,
        getConversation,
        sendNewMessage,
        users,
    };
};
