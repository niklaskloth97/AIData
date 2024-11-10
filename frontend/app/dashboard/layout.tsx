import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <main>
        <SidebarTrigger className="m-2"/>
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
