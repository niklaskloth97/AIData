import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
 
export const createClient = () => {
  const apiUrl = 
    "http://127.0.0.1:8123";
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
  return createClient().runs.stream(
    threadId,
    assistantId,
    {
      input: {
        messages: message,
      },
      streamMode: "messages-tuple",
      metadata: currentPage ? { page: currentPage } : undefined
    },
  );
}