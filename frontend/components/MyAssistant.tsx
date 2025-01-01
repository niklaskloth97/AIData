import React, { useRef } from "react";
import { Thread } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { createThread, getThreadState, sendMessage, handleInterrupt} from "@/lib/chatApi";

const MarkdownText = makeMarkdownText();

const streamMessages = async (threadId: string, messages: LangChainMessage) => {
  const client = createClient();
  const responseStream = client.runs.stream(
    threadId,
    "setup",
    {
      input: {
        messages: messages,
      },
      streamMode: "messages",
    }
  );

  for await (const message of responseStream) {
    // Handle each streamed message
    displayMessage(message);
  }
};

const getUserInput = async (question: string): Promise<string> => {
  return new Promise((resolve) => {
    const userInput = window.prompt(question);
    resolve(userInput || "");
  });
};


export function MyAssistant() {
  const threadIdRef = useRef<string | undefined>(undefined);
  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current;
      try {
        await streamMessages(threadId, messages[0]);
      } catch (interrupt) {
        // Handle interruption
        const userInput = await getUserInput(interrupt.message);
        await handleInterrupt(threadId, userInput);
      }
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages };
    },
  });

  return (
    <Thread
      runtime={runtime}
      assistantMessage={{ components: { Text: MarkdownText } }}
    />
  );
}
