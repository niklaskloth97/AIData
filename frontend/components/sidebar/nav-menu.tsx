import { ChevronRight, LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/sidebar/multisidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";

export function NavMenu({
    items,
}: {
    items: {
        title: string;
        url?: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) =>
                        item.items ? (
                            <Collapsible
                                key={item.title} // ← Moved key here
                                asChild
                                defaultOpen={item.isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <Link href={subItem.url}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </SidebarMenuSubButton>
                                                    </Link>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <Link href={item.url ? item.url : "/"}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        )
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
