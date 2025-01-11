import { RotateCcw, SendHorizontal } from "lucide-react";
import AIChatBubble from "./chat-sidebar/AIChatBubble";
import UserChatBubble from "./chat-sidebar/UserChatBubble";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import LoadingBubble from "./chat-sidebar/LoadingBubble";
import { useState } from "react";

export default function InitialChatWindow({messages, handleReset, handleSendMessage, proceedStep, proceedDisabled, input, setInput, aiLoading}) {
    
   
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    return (
        <>
            <div
                id="message-container"
                className="text-sm flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4"
            >
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                <div className="flex-grow" />
                {messages.map((message, index) => {
                    if (message.role === "human") {
                        return <UserChatBubble key={index} message={message} />;
                    } else {
                        return <AIChatBubble key={index} message={message} />;
                    }
                })}
                {aiLoading && <LoadingBubble />}
            </div>
            <div className="flex flex-col gap-2">
                <Textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (use Shift + Enter to send)"
                    className=""
                ></Textarea>
                <div className="flex w-full gap-1">
                    <Button onClick={handleReset} className="w-full">
                        <RotateCcw />
                    </Button>
                    <Button onClick={handleSendMessage} className="w-full">
                        <SendHorizontal />
                    </Button>
                    <Button onClick={proceedStep} disabled={proceedDisabled} className="w-full font-medium">
                        Proceed to next step
                    </Button>
                </div>
            </div>
        </>
    );
}
