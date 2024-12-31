import { Client, ThreadState } from "@langchain/langgraph-sdk";
import { LangChainMessage } from "@assistant-ui/react-langgraph";
 
const createClient = () => {
  const apiUrl = 
    "http://127.0.0.1:2024";
  return new Client({
    apiUrl,
    apiKey: "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",
  });
};
 
export const createThread = async () => {
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
  messages: LangChainMessage;
}) => {
  const client = createClient();
  return client.runs.stream(
    params.threadId,
    "setup"!,
    {
      input: {
        messages: params.messages,
      },
      streamMode: "updates",
    },
  );
};