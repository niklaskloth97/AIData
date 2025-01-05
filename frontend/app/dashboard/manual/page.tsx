"use client"

import PageHeader from "@/components/PageHeader";
import Manual from "@/markdown/manual.mdx";

export default function Page() {
    return (
        <>
            <PageHeader heading="Manual" subtext="This is the subtext."/>
            <Manual />
        </>
    );
}