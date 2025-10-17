import React from "react";
import { Check, CheckCheck } from "lucide-react";
import moment from 'moment';
import TypingAnimation from "../animations/TypingAnimation";

type MessageBubbleProps = {
    data: MessageData;
    isSent?: boolean;
    isRead: boolean;
};

type MessageData = {
    message?: string;
    timestamp: Date;
};

export function MessageBubble({ data, isSent, isRead }: MessageBubbleProps) {
    return (
        <>
            <div className={`flex ${isSent ? "justify-start" : "justify-end"} py-2`}>
                <div className={`inline-block max-w-[45%] break-words ${isSent ? "bg-blue-500 text-slate-50" : "bg-gray-200 text-gray-800"} rounded-lg px-4 py-2 shadow-md`}>
                    <p className="text-sm sm:text-base">{data.message}</p>
                    <div className="mt-1 flex items-center justify-end space-x-1">
                        <span className="text-xs opacity-75">
                            {moment(data.timestamp).isAfter(moment().subtract(6, 'days')) 
                                // Last 6 days
                                ? moment(data.timestamp).calendar() 
                                // More than 6 days
                                : moment(data.timestamp).format('L') + " " + moment(data.timestamp).format('LT')
                            }
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

export function MessageBubbleTyping() {
    return (
        <>
            <div className={`flex justify-start py-2`}>
                <div className={`flex justify-center w-24 h-14 break-words bg-blue-500 text-slate-50 rounded-lg p-4 shadow-md`}>
                    <TypingAnimation />
                </div>
            </div>
        </>
    );
}