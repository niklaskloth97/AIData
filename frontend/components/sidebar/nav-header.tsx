import NavLogoHeader from "@/components/sidebar/nav-header-logo";
import { NavProjectsHeader } from "@/components/sidebar/nav-header-projects";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

//Project items.
const projects = [
    {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
    },
];

export function NavHeader(){
    return(
        <>
            <NavLogoHeader />
            <NavProjectsHeader projects={projects}/>
        </>
    )
}