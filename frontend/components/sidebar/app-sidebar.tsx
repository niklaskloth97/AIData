"use client";

import {
    BookOpen,
    Bot,
    Database,
    FlaskConical,
    Settings,
    Table2,
} from "lucide-react";
import { NavMenu } from "@/components/sidebar/nav-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { NavFooter } from "@/components/sidebar/nav-footer";
import { NavHeader } from "@/components/sidebar/nav-header";

// Menu items.
const menuItems = [
    {
        title: "Context",
        url: "context",
        icon: BookOpen,
    },
    {
        title: "Data Sources",
        url: "datasources",
        icon: Database,
        items: [
            {
                title: "Databases",
                url: "databases",
            },
            {
                title: "Files",
                url: "files",
            }
        ]
    },
    {
        title: "Tables",
        url: "tables",
        icon: Table2,
    },
    {
        title: "Tests",
        url: "tests",
        icon: FlaskConical,
    },
    {
        title: "Models",
        url: "models",
        icon: Bot,
    },
    {
        title: "Settings",
        url: "settings",
        icon: Settings,
    },
];



export function AppSidebar() {
    return (
        <Sidebar side="left" variant="inset">
            <SidebarHeader className="">
                <NavHeader/>
            </SidebarHeader>
            <SidebarContent>
                <NavMenu items={menuItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter />
            </SidebarFooter>
        </Sidebar>
    );
}
