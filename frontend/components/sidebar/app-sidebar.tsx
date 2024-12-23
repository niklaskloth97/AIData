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
        url: "processmodel",
        icon: Workflow,
    },
    {
        title: "Data Models",
        url: "datamodels",
        icon: Database,
        items: [
            {
                title: "Editor",
                url: "datamodels/editor",
            },
            {
                title: "Instances",
                url: "datamodels/instances",
            }
        ]
    },
    {
        title: "Generate",
        url: "generate",
        icon: BotIcon,
        items: [
            {
                title: "Workbench",
                url: "generate/workbench",
            },
            {
                title: "History",
                url: "generate/history",
            }
        ]
    },
    {
        title: "Tests",
        url: "tests",
        icon: FlaskConical,
        items: [
            {
                title: "Execute",
                url: "tests/execute",
            },
            {
                title: "History",
                url: "tests/history",
            }
        ]
    },
    {
        title: "Manual",
        url: "manual",
        icon: BookOpen,
    },
    {
        title: "Settings",
        url: "settings",
        icon: Settings,
        items: [
            {
                title: "Databases",
                url: "settings/database",
            },
            {
                title: "Files",
                url: "settings/files",
            },
            {
                title: "Billing and Pricing",
                url: "settings/billing",
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
