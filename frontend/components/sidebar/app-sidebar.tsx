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
        title: "Process Modoel",
        url: "processmodel",
        icon: Workflow,
    },
    {
        title: "Data Models",
        url: "data-models",
        icon: Database,
        items: [
            {
                title: "Editor",
                url: "data-models/editor",
            },
            {
                title: "Instances",
                url: "data-models/instances",
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
                url: "workbench",
            },
            {
                title: "History",
                url: "history",
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
                url: "execute-tests",
            },
            {
                title: "History",
                url: "history-tests",
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
        url: "datamodels",
        icon: Settings,
        items: [
            {
                title: "Databases",
                url: "database-settings",
            },
            {
                title: "Files",
                url: "files-settings",
            },
            {
                title: "Billing and Pricing",
                url: "billing-pricing",
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
