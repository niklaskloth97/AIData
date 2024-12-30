"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

import { Client } from "@langchain/langgraph-sdk";
import { RemoteGraph } from "@langchain/langgraph/remote";

const client = new Client({
  apiKey: "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",
  //apiUrl: "http://localhost:8123",
  apiUrl: "http://127.0.0.1:2024",
});

const graphName = "setup";
const remoteGraph = new RemoteGraph({ graphId: graphName, client });

const ChatInteraction = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    const initializeThread = async () => {
      try {
        // Create a thread or resume an existing one
        const thread = await client.threads.create();
        setThreadId(thread.thread_id);
        console.log("Thread ID:", thread.thread_id);  
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    };

    initializeThread();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !threadId) return;

    const newMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, newMessage]); // Add user message to the state
    setInputValue(""); // Clear the input field

    try {
      setLoading(true);

      // Configure the graph invocation with the thread ID
      const config = { configurable: { thread_id: threadId } };
      const result = await remoteGraph.invoke({
        messages: [...messages, newMessage],
        config,
      });

      // Extract messages from the result
      const assistantMessages = result.messages.filter((msg: any) => msg.role === "assistant");
      setMessages((prev) => [...prev, ...assistantMessages]);

      // Verify the persisted state
    } catch (error) {
      console.error("Error during graph invocation:", error);
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
              style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
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
};

export default ChatInteraction;
