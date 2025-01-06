"use client";
import { DataTable } from "@/components/DataTable";
import { columns, TableData } from "./columns";
import PageHeader from "@/components/PageHeader";
import useMockTables from "@/hooks/api/useMockTables";
import { Loader } from "lucide-react";

export default function Page() {
    const { isLoading, data } = useMockTables();
    const mockData = data ?? [];

    return (
        <>
            <PageHeader
                heading="Data Model Editor"
                subtext="Change, which data are used in the system."
            />
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <DataTable data={mockData} columns={columns} />
            )}
        </>
    );
}