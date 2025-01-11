import { Message } from "./ChatSidebar";

export default function AIChatBubble({ message }: { message: Message }) {
    return (
        <div className="bg-gray-200 p-2 self-start hyphens-auto break-words rounded-lg mr-2 shadow-md">{message.message}</div>
    );
}
