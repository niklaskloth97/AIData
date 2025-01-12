"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFloatingWindow } from "@/components/TableFloatingWindow";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { useRouter, useSearchParams } from 'next/navigation'
import useTableColumn, { ColumnData } from "@/hooks/api/useTableColumn";

export default function Page() {
    const searchParams = useSearchParams()
    const targetTable = searchParams.get('targetTable') ?? "NO QUERY PRESENT";
    const router = useRouter();

    const { isLoading, data } = useTableColumn(targetTable);
    const [tableData, setTableData] = useState<ColumnData[]>([]);
    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Load initial data
    useEffect(() => {
        setTableData(data ?? []);
    }, [data]);

    return (
        <>
            <PageHeader
                heading={`Data Model Editor for ${targetTable} table`}
                subtext={`Inspect the columns of the ${targetTable} table.`}
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
                    data={tableData?? []} 
                    columns={columns}
                    globalFilter={globalFilter}
                    setData={setTableData}
                />
            )}

            <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => router.back()}>
                    Back
                </Button>
                <Button variant="default" disabled={true} onClick={() => setFloatingWindowOpen(true)}>
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