import { Message } from "@/components/chat-sidebar/ChatSidebar";

export default function UserChatBubble({message}: {message: Message}) {
    return (
        // <div className="flex justify-end ">
        <div
            className="bg-gray-800 whitespace-pre-wrap text-white self-end p-2 px-4 inline-block hyphens-auto break-words rounded-lg ml-2 shadow-md"
        >
            {message.message}
        </div>
        // </div>
    );
}