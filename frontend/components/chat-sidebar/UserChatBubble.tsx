import { Message } from "@/components/chat-sidebar/ChatSidebar";

export default function UserChatBubble({message}: {message: Message}) {
    return (
        <div
            className="bg-gray-800 text-white p-2 rounded-lg ml-2"
        >
            {message.message}
        </div>
    );
}