"use client";

import { makeMarkdownText } from "@assistant-ui/react-markdown";
import Link from "next/link";
import { MyAssistant } from "@/components/MyAssistant";
import ChatSidebar from "@/components/chat-sidebar/ChatSidebar";
import InitialChatWindow from "@/components/initialChatWindow";
import { useEffect, useState } from "react";
import { createThread, invokeHumanMessage, sendMessage} from "@/lib/langgraphSDK";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";

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

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [threadId, setThreadId] = useState("");
    const [runId, setRunId] = useState("");
    const [aiLoading, setAILoading] = useState(false);
    const [input, setInput] = useState("");
    const [proceedDisabled, setProceedDisabled] = useState(false);
    const [processDetected, setProcessDetected] = useState(false);
    
    const router = useRouter();

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
        setProcessDetected(false);
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
                let response;
                if (processDetected) {
                    response = await invokeHumanMessage({
                        threadId,
                        assistantId: "setup",
                        message: {type: "human", content: humanWords },
                        currentPage: window.location.href,
                    });
                }
                else {
                    response = await sendMessage({
                        threadId,
                        assistantId: "setup",
                        message: { type: "human", content: humanWords },
                        currentPage: window.location.href,
                    });
                }
                // Access the messages array
                console.log(response);
                const messages = response["messages"];
                if (response["detected_process"] != null){
                    setProcessDetected(true);
                    console.log("Process detected");
                }
                // Safely get the content of the last message
                // (assuming messages always has at least one element)
                const lastMessageContent = messages[messages.length - 1].content;
                answer = answer.concat(lastMessageContent);
            } catch (e) {
                console.log("Error sending message", e);
                answer =
                    "Sorry, I'm having trouble connecting to the server. Please try again later.";
            }

            setAILoading(false);
            addMessageToDisplay({ role: "ai", message: answer });
        }
    };

    function proceedStep() {
        router.push("/setup/additional-events");
    }

    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center gap-2 card">
            <div className="flex flex-col w-1/2 h-screen justify-center gap-2 ">
                {/* <div className="h-5/6"> */}
                    <PageHeader
                        heading="Outline Target Process"
                        subtext="Chat with the AI and describe the process that should be represented in the event log. The AI will provide you with suggestions based on your input."
                    ></PageHeader>
                    <div className="flex flex-col p-4 h-4/6 gap-4 bg-white rounded-lg border bg-card text-card-foreground shadow">
                        <InitialChatWindow
                            messages={messages}
                            handleReset={handleReset}
                            handleSendMessage={handleSendMessage}
                            aiLoading={aiLoading}
                            input={input}
                            setInput={setInput}
                            proceedStep={proceedStep}
                            proceedDisabled={proceedDisabled}
                        />
                    </div>
                {/* </div> */}
            </div>
            {/* <div className="flex flex-col gap-2 border-black border-2 rounded-lg border-t-0 w-full">
                <div></div>
                <Button> Proceed </Button>
            </div> */}
        </main>
    );
}
