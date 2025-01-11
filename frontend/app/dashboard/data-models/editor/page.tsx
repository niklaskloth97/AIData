"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import useMockTables from "@/hooks/api/useMockTables";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFloatingWindow } from "@/components/TableFloatingWindow";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";

export default function Page() {
    const { isLoading, data } = useMockTables();
    const mockData = data ?? [];
    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    return (
        <>
            <PageHeader
                heading="Data Model Editor"
                subtext="Change, which data are used in the system."
            />
            <SelectNSearchTable 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectButton="Select Table"
            />
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <DataTable 
                    data={mockData} 
                    columns={columns}
                    globalFilter={globalFilter}
                />
            )}

            <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => alert("Going back")}>
                    Back
                </Button>
                <Button variant="default" onClick={() => setFloatingWindowOpen(true)}>
                    Continue
                </Button>
            </div>

            <TableFloatingWindow
                isOpen={floatingWindowOpen}
                onClose={() => setFloatingWindowOpen(false)}
            />
        </>
    );
}