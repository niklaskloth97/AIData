import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <main className="p-2">
        <SidebarTrigger className="bg-white"/>
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
