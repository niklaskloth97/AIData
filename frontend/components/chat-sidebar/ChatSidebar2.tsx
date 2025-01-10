import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/sidebar/multisidebar";
import { Thread } from "@assistant-ui/react";

export default function ChatSidebar() {
    const messages = [
        { role: "user", message: "Hello" },
        { role: "ai", message: "Hi! How can I help you today?" },
        { role: "user", message: "I need help with my order" },
        { role: "ai", message: "Sure! What's your order number?" },
        { role: "user", message: "123456" },
        { role: "ai", message: "Thank you! Let me check that for you" },
        {
            role: "ai",
            message: "It looks like your order is currently being processed",
        },
        { role: "ai", message: "It should be shipped out by tomorrow" },
        { role: "user", message: "Thank you!" },
        { role: "ai", message: "You're welcome! Have a great day!" },
        { role: "user", message: "Goodbye" },
        { role: "ai", message: "Goodbye!" },
        { role: "user", message: "Hello" },
        { role: "ai", message: "Hi! How can I help you today?" },
    ];

    return (
        <Sidebar side="right" variant="inset">
            <SidebarContent className="h-screen flex flex-col">
                <Thread />
            </SidebarContent>
        </Sidebar>
    );
}
