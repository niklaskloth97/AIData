import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/sidebar/multisidebar";

export default function ChatSidebar(){
    return(
        <Sidebar  side="right" variant="inset">
            <SidebarHeader className="">
                <div/>
            </SidebarHeader>
            <SidebarContent>
                <div/>
            </SidebarContent>
            <SidebarFooter>
                <div/>
            </SidebarFooter>
        </Sidebar>
    )
}