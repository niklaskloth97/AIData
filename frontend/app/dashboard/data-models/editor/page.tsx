"use client";
import { DataTable } from "@/components/DataTable";
import { columns, TableData } from "./columns";
import PageHeader from "@/components/PageHeader";
import useMockTables from "@/hooks/api/useMockTables";

export default function Page() {
    const { isLoading, data } = useMockTables();
    const mockData = data ?? [];

    return (
        <>
            <PageHeader
                heading="Data Model Editor"
                subtext="This is the subtext."
            />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <DataTable data={mockData} columns={columns} />
            )}
        </>
    );
}
