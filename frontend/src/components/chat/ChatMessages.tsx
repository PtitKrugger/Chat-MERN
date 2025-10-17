import React, { useEffect, useRef } from "react";
import { Message } from "../../types/message";
import { MessageBubble, MessageBubbleTyping, } from "./MessageBubbles";

interface ChatMessagesProps {
    messages: Message[];
    userId: string | null;
    showTypingIndicator: boolean;
}

export default function ChatMessages({ messages, userId, showTypingIndicator }: ChatMessagesProps) {
    return (
        <div className="px-4">
            {messages.length !== 0 && Array.isArray(messages) ? (
                <>
                    {messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            data={{ message: message.message, timestamp: message.createdAt }}
                            isSent={userId !== message.senderId}
                            isRead={false}
                        />
                    ))}

                    {showTypingIndicator && <MessageBubbleTyping />}
                </>
            ) : (
                <h1 className="pt-2 text-center text-gray-500">
                    Start the conversation !
                </h1>
            )}
        </div>
    );
}
