import React, { useRef, useState, useEffect } from 'react';
import { LogOut, MessagesSquare } from "lucide-react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { Link } from "react-router";
import { io, Socket } from "socket.io-client";

import "../../index.css"
import ContactBar from "../../components/chat/ContactBar";
import { useChat } from '../../hooks/useChat';
import { User } from '../../types/user';
import { Message } from '../../types/message';
import { useAuth } from '../../hooks/useAuth';
import ChatMessages from '../../components/chat/ChatMessages';
import MainPageMobile from '../mobile/chat/MainPage';

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

    const [isUserOnPc, setIsUserOnPc] = useState<boolean>(true)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 500) {
                setIsUserOnPc(false)
            }

        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);


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

    return (
        <>
            {isUserOnPc === true ?
                <div className="flex h-screen max-h-screen w-full flex-col">
                    <ToastContainer position="top-center" toastClassName="text-black" aria-label="" />
                    <div className="flex h-fit justify-end m-4">
                        <Link to="/logout">
                            <LogOut
                                className="cursor-pointer rounded-md bg-gray-100 p-1 shadow-md transition-transform duration-200 hover:scale-110"
                                size={32}
                            />
                        </Link>
                    </div>

                    <div className="flex h-[85%] flex-1 items-center justify-center">
                        <div className="flex h-[95%] min-h-min w-[80%] min-w-[650px] shadow-xl">
                            <div className="w-[25%] border-y border-l bg-gray-50">
                                {/* Current user panel */}
                                <div className="flex h-[14%] w-full items-center gap-4 border-b bg-white p-4">
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

                            {/* Chat */}
                            <div className='w-[80%] border'>
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
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="h-[70%] overflow-y-auto bg-gray-50">
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
                        </div>
                    </div>
                </div>
                :
                <MainPageMobile></MainPageMobile>
            }
        </>
    );
}