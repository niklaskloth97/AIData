import { Client, ThreadState, Run } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
import { runInCleanSnapshot } from "next/dist/server/app-render/clean-async-snapshot-instance";
 
export const createClient = () => {
  const apiUrl = 
    "http://127.0.0.1:2024";
  return new Client({
    apiUrl: apiUrl,
    apiKey: "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",
  });
};

 
export function createThread() {
  const client = createClient();
  return client.threads.create();
};
 
export const getThreadState = async (
  threadId: string,
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

export function sendMessage({threadId, assistantId, message, currentPage}: {threadId: string, assistantId: string, message: LangChainMessage, currentPage?: string}) {
  return createClient().runs.wait(
    threadId,
    assistantId,
    {
      input: {
        messages: message,
      },
      //streamMode: "messages-tuple",
      metadata: currentPage ? { page: currentPage } : undefined
    },
  );
}

export async function invokeHumanMessage({threadId, assistantId, message, currentPage}: {threadId: string, assistantId: string, message: LangChainMessage, currentPage?: string}) {
    // 2. Create a new message of type 'human'

    // 3. Update the thread state with this human message
    const client = createClient();
    await client.threads.updateState(threadId, {
        values: { messages: message },
        asNode: "human_feedback"
    });
    return createClient().runs.wait(
      threadId,
      assistantId,
      {
        input: null,
        //streamMode: "messages-tuple",
        metadata: currentPage ? { page: currentPage } : undefined
      },
    );
  }