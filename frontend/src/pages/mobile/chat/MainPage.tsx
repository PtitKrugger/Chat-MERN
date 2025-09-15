import React, { useRef, useState, useEffect } from 'react';
import { LogOut, MessagesSquare, Undo2 } from "lucide-react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { Link } from "react-router";
import { io, Socket } from "socket.io-client";

import "../../../index.css"
import ContactBar from "../../../components/chat/ContactBar";
import { useChat } from '../../../hooks/useChat';
import { User } from '../../../types/user';
import { Message } from '../../../types/message';
import { useAuth } from '../../../hooks/useAuth';
import ChatMessages from '../../../components/chat/ChatMessages';

export default function MainPage() {
    const [selectedUser, setSelectedUser] = useState<User>()
    const selectedUserIdRef = useRef<string | undefined>();
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState<string>()
    const { getAllUsers, setOnlineUserIds, getConversation, sendNewMessage, users } = useChat()
    const { checkAuth } = useAuth()
    const [userId, setUserId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User>();
    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isUsersDivSliding, setIsUsersDivSliding] = useState(false);
    const [isChatDivSliding, setIsChatDivSliding] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { isLoggedIn, response } = await checkAuth()

            if (isLoggedIn && response) {
                getAllUsers();
                setUserId(response.data._id)
                setCurrentUser(response.data)

                socketRef.current = io("http://localhost:3000", {
                    withCredentials: true
                })

                socketRef.current.on("getOnlineUsers", (onlineUsers) => {
                    setOnlineUserIds(onlineUsers)
                })

                socketRef.current.on("receiveMessage", (receivedMessage: Message) => {
                    if (selectedUserIdRef.current !== undefined && receivedMessage.senderId === selectedUserIdRef.current) {
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages, receivedMessage]
                            return updatedMessages
                        })
                    }
                })
            }
        };

        fetchData()

        return () => {
            socketRef.current?.disconnect()
        }
    }, [])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    async function changeSelectedUser(userId: string) {
        const user = JSON.parse(JSON.stringify(users.find(u => u._id === userId)));
        const selectedUser = users.find(u => u._id === userId);

        if (selectedUser) {
            //console.log("Selected User:", selectedUser)
            setSelectedUser(user);
            selectedUserIdRef.current = selectedUser._id
        }

        try {
            const response = await getConversation(userId);

            if (response) {
                setMessages(response.data as Array<Message>);
                setIsUsersDivSliding(true)
                await wait(650)
                setIsUsersDivSliding(false)

                setIsVisible(false)
            }
        }
        catch (e: any) {
            toast.error(`An error has occured: ${e.response.data.error}`, {
                position: "top-center",
                transition: Zoom
            });
        }
    }

    async function submitNewMessage() {
        if (selectedUserIdRef.current !== undefined && newMessage !== undefined && newMessage !== '') {
            try {
                const response = await sendNewMessage(selectedUserIdRef.current, newMessage)

                if (response) {
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, response.data]
                        return updatedMessages
                    })

                    setNewMessage('')
                }
            }
            catch (e: any) {
                e.response !== undefined ?
                    toast.error(`An error has occured: ${e.response.data.error}`, {
                        position: "top-center",
                        transition: Zoom
                    })
                    :
                    toast.error(`An error has occured: ${e}`, {
                        position: "top-center",
                        transition: Zoom
                    });
            }
        }
    }

    function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function goBack() {
        setIsChatDivSliding(true)
        // Wait for the DIV transition
        await wait(650)
        setIsChatDivSliding(false)
        setIsVisible(true)
    }

    return (
        <>
            <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
            {isVisible ?
                <div className={`${isUsersDivSliding ? "transition-all duration-700 ease-out -translate-x-full" : "translate-x-0"}`}>
                    <div className='flex h-[14%] w-full items-center gap-4 border-b bg-white p-4'>
                        <img
                            src={currentUser !== undefined ? currentUser.pfp : ''}
                            className="h-14 w-14 rounded-full border border-black"
                        />
                        <div className="flex flex-col">
                            <strong className="text-lg font-medium text-slate-900">
                                {currentUser?.username || '...'}
                            </strong>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                                Online
                                <span className="inline-block h-0 w-0 translate-y-[1px] cursor-pointer border-b-4 border-l-4 border-r-4 border-b-black border-l-transparent border-r-transparent"></span>
                            </span>
                        </div>
                    </div>

                    {/* Contact Bar */}
                    <ContactBar
                        users={users}
                        selectedUser={selectedUser}
                        emitSelectedUserChange={changeSelectedUser}
                    />
                </div>
                :
                <div className={`${isChatDivSliding ? "transition-all duration-700 ease-in-out translate-x-full" : "translate-x-1"} h-screen`}>
                    {/* Header */}
                    <div className="flex h-[14%] w-full items-center gap-4 border-b bg-white p-4">
                        <img
                            src={selectedUser?.pfp}
                            className="h-14 w-14 rounded-full border border-black"
                        />
                        <div className="flex flex-col">
                            <strong className="text-lg font-medium text-slate-900">
                                {selectedUser?.username || '...'}
                            </strong>
                            {(selectedUser !== undefined) && selectedUser.isOnline === true ? (
                                <span className="text-sm font-medium text-green-600 dark:text-slate-400">
                                    Online
                                </span>
                            ) : (
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Offline
                                </span>
                            )}
                        </div>
                        <div className='flex h-[100%] w-[100%] justify-end items-center pr-2'>
                            <Undo2 height={32} width={32} onClick={() => goBack()} className="cursor-pointer rounded-md bg-gray-100 p-1 shadow-md transition-transform duration-200 hover:scale-110" />                            
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[70%] max-h-[70%] min-h-0 overflow-y-scroll bg-gray-50">
                        <ChatMessages messages={messages} userId={userId} />
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="flex h-[16%] items-center gap-4 border-t bg-white p-4">
                        <textarea
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                            rows={2}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // empêche le retour à la ligne
                                    submitNewMessage();
                                }
                            }}
                            className={`flex-1 rounded-md resize-none px-3 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 ${!selectedUser ? 'pointer-events-none bg-gray-100' : 'bg-white'}`}
                            placeholder="Write a message..."
                        ></textarea>
                        <button
                            onClick={submitNewMessage}
                            className={`px-4 py-2 rounded-md text-white font-semibold bg-blue-600 hover:scale-105 transition-transform ${!selectedUser ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Send
                        </button>
                    </div>
                </div>
            }
        </>

    );
}