"use client";
import React, { useState, useEffect } from "react";
import { Client } from "@langchain/langgraph-sdk";
import PageHeader from "@/components/PageHeader";

import Link from "next/link";


interface Assistant {
  name: string;
  assistant_id: string;
}

const client = new Client({
  apiKey: "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",
  apiUrl: "http://127.0.0.1:2024",
});

const ChatInteraction = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const assistantsList = await client.assistants.search({
          metadata: null,
          offset: 0,
          limit: 10,
        });
        setAssistants(assistantsList);

        if (assistantsList.length > 0) {
          setSelectedAssistant(assistantsList[0]);
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };

    initializeClient();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedAssistant) return;

    const newMessage = { role: "human", content: inputValue };
    setMessages((prev) => [...prev, newMessage]); // Add user message to the state
    setInputValue(""); // Clear the input field

    try {
      setLoading(true);
      const thread = await client.threads.create();

      const streamResponse = client.runs.stream(
        thread["thread_id"],
        selectedAssistant["assistant_id"],
        {
          input: { messages: [...messages, newMessage] },
        }
      );

      let assistantResponse = null;

      for await (const chunk of streamResponse) {
        if (chunk.event === "values") {
          const newMessages = chunk.data.messages.map((msg: { content: string }) => ({
            role: "assistant",
            content: msg.content,
          }));

          // Always keep only the last assistant response
          assistantResponse = newMessages.slice(-1)[0];
        }
      }

      // Update the state with the last assistant response
      if (assistantResponse) {
        setMessages((prev) => [...prev, assistantResponse]);
      }
    } catch (error) {
      console.error("Error during streaming:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle text formatting with line breaks
  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Wrapper div around everything */}
      <div className="max-w-3xl w-full space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <PageHeader
            heading={"Outline target process"}
            subtext={
              "Chat with the AI and describe the process that should be represented in the event log. The AI will provide you with suggestions based on your input."
            }
          />
          {/* Chat Area */}
          <div className="p-6 pt-0">
            <div
              className="space-y-4 h-96 overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }} // Optional custom scrollbar
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                    message.role === "human"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {formatMessageContent(message.content)}
                </div>
              ))}
            </div>
          </div>
  
          {/* Proceed Button */}
          <div className="flex items-center justify-center p-4">
            <Link href="/additional-events">
              <button className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Proceed
              </button>
            </Link>
          </div>
  
          {/* Input Area */}
          <div className="flex items-center p-6 pt-0">
            <form
              className="flex w-full items-center space-x-2"
              onSubmit={handleSendMessage}
            >
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                id="message"
                placeholder="Type your message..."
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
              />
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                type="submit"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
                <span className="sr-only">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );    
}
  

export default ChatInteraction;
