"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/sidebar/multisidebar";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { RotateCcw, SendHorizontal } from "lucide-react";
import UserChatBubble from "./UserChatBubble";
import AIChatBubble from "./AIChatBubble";
import { createThread, sendMessage } from "@/lib/langgraphSDK";
import { set } from "zod";
import { send } from "process";
import LoadingBubble from "./LoadingBubble";

const mockMessages = [
    { role: "human", message: "Hello" },
    { role: "ai", message: "Hi! How can I help you today?" },
    { role: "human", message: "I need help with my order" },
    { role: "ai", message: "Sure! What's your order number?" },
    { role: "human", message: "123456" },
    { role: "ai", message: "Thank you! Let me check that for you" },
    {
        role: "ai",
        message: "It looks like your order is currently being processed",
    },
    { role: "ai", message: "It should be shipped out by tomorrow" },
    { role: "human", message: "Thank you!" },
    { role: "ai", message: "You're welcome! Have a great day!" },
    { role: "human", message: "Goodbye" },
    { role: "ai", message: "Goodbye!" },
    { role: "human", message: "Hello" },
    { role: "ai", message: "Hi! How can I help you today?" },
];

export interface Message {
    role: string;
    message: string;
}

export default function ChatSidebar() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [threadId, setThreadId] = useState("");
    const [aiLoading, setAILoading] = useState(false);

    // This enables the scroll down when messages are added
    useEffect(() => {
        const container = document.getElementById("message-container");
        container?.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    // Setup Chat Client
    useEffect(() => {
        async function setup() {
            const thread = await createThread();
            setThreadId(thread.thread_id);
        }
        setup();
    }, []);

    async function handleReset() {
        setMessages([]);
        setThreadId((await createThread()).thread_id);
        setInput("");
    }

    function addMessageToDisplay(message: Message) {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function prepareHumanMessage(message: string) {
        return { role: "human", message };
    }

    const handleSendMessage = async () => {
        if (input.trim()) {
            const humanWords = input;
            setInput(""); // Clear input after sending
            addMessageToDisplay({ role: "human", message: humanWords });
            setAILoading(true);
            let answer = "";
            try {
                const response = await sendMessage({
                    threadId,
                    assistantId: "agent",
                    message: { type: "human", content: humanWords },
                    currentPage: window.location.href,
                });
                console.log("hiii")
                for await (const chunk of response) {
                    if (chunk.event === "messages") {
                        answer = answer.concat(chunk.data[0].content);
                    }
                }
            } catch(e) {
                console.log("Error sending message", e);
                answer = "Sorry, I'm having trouble connecting to the server. Please try again later.";
            }

            setAILoading(false);
            addMessageToDisplay({ role: "ai", message: answer });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Sidebar side="right" variant="inset">
            <SidebarContent className="h-screen flex flex-col overflow-visible">
                <div
                    id="message-container"
                    className="text-sm flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4"
                >
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                    <div className="flex-grow" />
                    {messages.map((message, index) => {
                        if (message.role === "human") {
                            return (
                                <UserChatBubble key={index} message={message} />
                            );
                        } else {
                            return (
                                <AIChatBubble key={index} message={message} />
                            );
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
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
