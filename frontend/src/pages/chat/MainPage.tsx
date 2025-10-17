import React, { useRef, useState, useEffect } from 'react';
import { LogOut } from "lucide-react";
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
import UserPanel from '../../components/chat/UserPanel';
import { useTimer } from '../../hooks/useTimer';

export default function MainPage() {
    const { getAllUsers, setOnlineUsers, getConversation, sendNewMessage, users } = useChat()

    const [userId, setUserId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User>();

    const socketRef = useRef<Socket | null>(null);

    const [selectedUser, setSelectedUser] = useState<User>()
    // Using a ref instead of state because refs update immediately
    const selectedUserIdRef = useRef<string | undefined>();

    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState<string>()

    const { checkAuth } = useAuth()

    const bottomConvRef = useRef<HTMLDivElement>(null);

    const userStatuses = [
        { value: "Online", textColor: "text-green-600", bgColor: "bg-green-500" },
        { value: "Away", textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
        { value: "Busy", textColor: "text-red-500", bgColor: "bg-red-500" }
    ];

    const [isUserOnPc, setIsUserOnPc] = useState<boolean>(true)

    const { startTimer, isTimerRunning, resetTimer } = useTimer()
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    
    // Detects window size changes and updates whether the user is on a PC or not.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 500) {
                setIsUserOnPc(false)
            }
            else {
                setIsUserOnPc(true)
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Get user data, users, connect to socket...
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
                    setOnlineUsers(onlineUsers)
                })

                socketRef.current.on("userTyping", (data) => {
                    if (data["isTyping"]) {
                        setIsOtherUserTyping(true)
                    } 
                    else {
                        setIsOtherUserTyping(false)
                    }
                })

                socketRef.current.on("receiveMessage", (receivedMessage: Message) => {
                    // If user is talking with the sender
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

    // When users are updated, it also update the selectedUser to display the correct status on the chat panel
    useEffect(() => {
        setSelectedUser(users.find((u) => u._id === selectedUserIdRef.current))
    }, [users])

    // Scroll to the bottom of the conv, when new message or isOtherUserTyping
    useEffect(() => {
        if (bottomConvRef.current) {
            bottomConvRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOtherUserTyping]);

    if (!isUserOnPc) {
        return <MainPageMobile />
    }

    function handleStatusChange(newStatus: string) {
        socketRef.current.emit("changeStatus", {
            status: newStatus
        })
    }

    function handleMessageTyping(message: string) {
        if (selectedUserIdRef.current !== undefined) {
            if (message.length > 0) {
                // Send typing status every 5s to prevent spamming socket on each textarea change
                if (!isTimerRunning) {
                    socketRef.current.emit("isTyping", { typingTo: selectedUserIdRef.current, isTyping: true })
                    startTimer(5)
                }
            }
            else {
                socketRef.current.emit("isTyping", { typingTo: selectedUserIdRef.current, isTyping: false })
                resetTimer()
            }
        }
    }

    async function changeSelectedUser(userId: string) {
        const user = JSON.parse(JSON.stringify(users.find(u => u._id === userId)));
        const selectedUser = users.find(u => u._id === userId);

        if (selectedUser) {
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

    function handleNewMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setNewMessage(e.target.value)
        handleMessageTyping(e.target.value)
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

                    socketRef.current.emit("isTyping", { typingTo: selectedUserIdRef.current, isTyping: false })
                    resetTimer()
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
                            <UserPanel currentUser={currentUser} emitStatusChange={handleStatusChange} />
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
                                    {(selectedUser !== undefined) && selectedUser.isOnline === true ? (
                                        <span className={`text-sm font-medium ${userStatuses.find((status) => status.value === selectedUser.status)['textColor']}`}>
                                            {selectedUser.status}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Offline
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="h-[70%] overflow-y-auto bg-gray-50">
                                <ChatMessages messages={messages} userId={userId} showTypingIndicator={isOtherUserTyping} />
                                <div ref={bottomConvRef} />
                            </div>

                            {/* Input */}
                            <div className="flex h-[16%] items-center gap-4 border-t bg-white p-4">
                                <textarea
                                    onChange={(e) => handleNewMessage(e)}
                                    value={newMessage}
                                    rows={2}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
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
        </>
    );
}