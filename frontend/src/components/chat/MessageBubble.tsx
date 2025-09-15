import React from "react";
import { Check, CheckCheck } from "lucide-react";

type MessageBubbleProps = {
    data: MessageData;
    isSent?: boolean;
    isRead: boolean;
};

type MessageData = {
    message?: string;
    timestamp: Date;
};

export default function MessageBubble({ data, isSent, isRead, }: MessageBubbleProps) {
    return (
        <>
            <div className={`flex ${isSent ? "justify-start" : "justify-end"} py-2`}>
                <div className={`inline-block max-w-[45%] break-words ${isSent ? "bg-blue-500 text-slate-50" : "bg-gray-200 text-gray-800"} rounded-lg px-4 py-2 shadow-md`}>
                    <p className="text-sm sm:text-base">{data.message}</p>
                    <div className="mt-1 flex items-center justify-end space-x-1">
                        <span className="text-xs opacity-75">
                            {new Date(data.timestamp).getHours().toString() +
                                ":" +
                                new Date(data.timestamp).getMinutes().toString()}
                        </span>
                        <span className="text-xs">
                            {isRead ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
