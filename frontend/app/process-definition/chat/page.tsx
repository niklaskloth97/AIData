"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Client } from "@langchain/langgraph-sdk";

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedAssistant) return;

    const newMessage = { role: "human", content: inputValue };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

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

      for await (const chunk of streamResponse) {
        if (chunk.event === "values") {
          const newMessages = chunk.data.messages.map((msg: { content: string }) => ({
            role: "assistant",
            content: msg.content,
          }));
          setMessages((prev) => [...prev, ...newMessages]);
        }
      }
    } catch (error) {
      console.error("Error during streaming:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.role === "human" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: message.role === "human" ? "#dcf8c6" : "#f1f1f1",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatInteraction;
