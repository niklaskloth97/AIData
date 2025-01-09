"use client"

import PageHeader from "@/components/PageHeader";

export default function Page() {
    return (
        <>
            <PageHeader heading="Welcome User!" subtext="This is the subtext."/>
            <div className="flex items-center justify-center mt-6">
            <img
            src="/process.webp"
            alt="Data Processing Flowchart"
            className="max-w-full h-auto"
            />
            </div>
        </>
    );
}