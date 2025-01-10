import { AppSidebar } from "@/components/sidebar/app-sidebar"
import ChatSidebar from "@/components/chat-sidebar/ChatSidebar";
import ChatSidebar2 from "@/components/chat-sidebar/ChatSidebar2";
import { MultiSidebarProvider, SidebarInset, SidebarTrigger } from "@/components/sidebar/multisidebar";

export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiSidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <main className="">
        <div className="mx-4 mt-4 mb-2 flex justify-between">
          <SidebarTrigger className="bg-white"/>
          <SidebarTrigger side="right" className="bg-white alig"/>
        </div>
        <div className="mx-6">
          {children}
        </div>
      </main>
      </SidebarInset>
      <ChatSidebar/>
    </MultiSidebarProvider>
  );
}
