import { Message } from "./ChatSidebar";

export default function AIChatBubble({ message }: { message: Message }) {
    return (
        <div className="bg-gray-200 p-2 rounded-lg mr-2">{message.message}</div>
    );
}
