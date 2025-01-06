import React, { useRef } from "react";
import { Thread } from "@assistant-ui/react";
import { LangChainMessage, useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { createThread, getThreadState, createClient } from "@/lib/chatApi";

const MarkdownText = makeMarkdownText();

export async function* streamMessages(
  threadId: string,
  messages: LangChainMessage[]
): AsyncGenerator<{ event: string; data: any }> {
  const client = createClient();
  const responseStream = client.runs.stream(threadId, "setup", {
    input: { messages },
    streamMode: "messages-tuple",
  });

  for await (const message of responseStream) {
    console.log('Received message:', message);
    yield { event: "message", data: message };
  }
}



export function MyAssistant() {
  const threadIdRef = useRef<string | undefined>(undefined);

  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages: LangChainMessage[]) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current!;
      return streamMessages(threadId, messages);
    },
  });
  return (
    <Thread
      runtime={runtime}
      assistantMessage={{ components: { Text: MarkdownText } }}
    />
  );
}
  // ... component rendering ...
 /*string ="""     try {
        await streamMessages(threadId, messages[0]);
      } catch (interrupt) {
        // Handle interruption
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
  """
  */

  

