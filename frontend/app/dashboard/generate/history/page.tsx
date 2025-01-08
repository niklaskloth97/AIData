"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import useWorkbenchHistory from "@/hooks/api/useWorkbenchHistory";
import { Loader } from "lucide-react";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";

export default function HistoryPage() {
    const { isLoading, data } = useWorkbenchHistory();
    const [globalFilter, setGlobalFilter] = useState("");

    return (
        <div className="p-6 space-y-8">
            <PageHeader
                heading="Workbench History"
                subtext="View and edit previous workbench sessions"
            />
            <SelectNSearchTable 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectButton="Select History Entry"
            />
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data ?? []}
                    globalFilter={globalFilter}
                />
            )}
        </div>
    );
}