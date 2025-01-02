"use client";

import {
    BookOpen,
    Bot,
    BotIcon,
    Database,
    FlaskConical,
    Settings,
    Settings2,
    Table2,
    Workflow,
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
        title: "Process Model",
        url: "/dashboard/process-model",
        icon: Workflow,
    },
    {
        title: "Data Models",
        // url: "dashboard/data-models",
        icon: Database,
        items: [
            {
                title: "Editor",
                url: "/dashboard/data-models/editor",
            },
            {
                title: "Instances",
                url: "/dashboard/data-models/instances",
            }
        ]
    },
    {
        title: "Generate",
        // url: "dashboard/generate",
        icon: BotIcon,
        items: [
            {
                title: "Workbench",
                url: "/dashboard/generate/workbench",
            },
            {
                title: "History",
                url: "/dashboard/generate/history",
            }
        ]
    },
    {
        title: "Tests",
        // url: "dashboard/tests",
        icon: FlaskConical,
        items: [
            {
                title: "Execute",
                url: "/dashboard/tests/execute",
            },
            {
                title: "History",
                url: "/dashboard/tests/history",
            }
        ]
    },
    {
        title: "Manual",
        url: "/dashboard/manual",
        icon: BookOpen,
    },
    {
        title: "Settings",
        // url: "dashboard/settings",
        icon: Settings,
        items: [
            {
                title: "General",
                url: "/dashboard/settings/general",
            },
            {
                title: "Databases",
                url: "/dashboard/settings/databases",
            },
            {
                title: "Files",
                url: "/dashboard/settings/files",
            },
            {
                title: "Billing and Pricing",
                url: "/dashboard/settings/billing",
            }
        ]
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
