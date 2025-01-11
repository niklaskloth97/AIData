import NavLogoHeader from "@/components/sidebar/nav-header-logo";
import { NavProjectsHeader } from "@/components/sidebar/nav-header-projects";
import { AudioWaveform, Bot, Command, GalleryVerticalEnd, HandCoins, Truck } from "lucide-react";

//Project items.
const projects = [
    {
        name: "[SAP] Order-to-Cash"  ,
        logo: HandCoins,
        plan: "Enterprise",
    },
    {
        name: "[SAP] Order-to-Delivery",
        logo: Truck,
        plan: "Startup",
    },
    {
        name: "Round-Nail-Production",
        logo: Bot,
        plan: "Free",
    },
];

export function NavHeader(){
    return(
        <>
            <NavLogoHeader link="/dashboard/start"/>
            <NavProjectsHeader projects={projects}/>
        </>
    )
}