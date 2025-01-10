import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { interrupt, Command } from "@langchain/langgraph";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
 
export const createClient = () => {
  const apiUrl = 
    "http://127.0.0.1:2024";
  return new Client({
    apiUrl,
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
 
export const sendMessage = async (params: {
  threadId: string;
  message: LangChainMessage;
}) => {
  const client = createClient();
  return client.runs.stream(
    params.threadId,
    "setup",
    {
      input: {
        messages: params.message,
      },
      streamMode: "messages-tuple",
    },
  );
};