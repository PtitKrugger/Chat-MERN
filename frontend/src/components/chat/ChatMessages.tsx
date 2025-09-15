import React, { useEffect, useRef, useState } from "react";
import { Message } from "../../types/message";
import MessageBubble from "./MessageBubble";

interface ChatMessagesProps {
    messages: Message[];
    userId: string | null;
}

export default function ChatMessages({ messages, userId }: ChatMessagesProps) {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div ref={chatRef} className="px-4">
                {messages.length !== 0 && Array.isArray(messages) ? (
                    messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            data={{ message: message.message, timestamp: message.createdAt }}
                            isSent={userId !== message.senderId}
                            isRead={false}
                        />
                    ))
                ) : (
                    <>
                        <h1 className="pt-2 text-center text-gray-500">
                            Start the conversation !
                        </h1>
                    </>
                )}
            </div>
        </>
    );
}
