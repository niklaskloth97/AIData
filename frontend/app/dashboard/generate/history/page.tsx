"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import useWorkbenchHistory from "@/hooks/api/useWorkbenchHistory";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
    const { isLoading, data } = useWorkbenchHistory();
    const [globalFilter, setGlobalFilter] = useState("");

    return (
        <>
            <PageHeader
                heading="Workbench History"
                subtext="View and edit previous workbench sessions"
            />
            <div className="flex items-center mb-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>

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
        </>
    );
}
