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
      <main className="">
        <div className="mx-4 mt-4 mb-2">
          <SidebarTrigger className="bg-white"/>
        </div>
        <div className="mx-6">
          {children}
        </div>
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
