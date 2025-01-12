"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import useMockTables, { TableData } from "@/hooks/api/useTables";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFloatingWindow } from "@/components/TableFloatingWindow";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";

export default function Page() {
    const { isLoading, data } = useMockTables();
    const [tableData, setTableData] = useState<TableData[]>([]);
    
    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Load initial data
    useEffect(() => {
        setTableData(data ?? []);
    }, [data]);

    return (
        <>
            <PageHeader
                heading="Data Model Editor"
                subtext="View which data are used in the system."
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
                    data={tableData ?? []} 
                    columns={columns}
                    globalFilter={globalFilter}
                    setData={setTableData}
                />
            )}

            <div className="mt-6 flex w-full justify-end">
                <Button className="" variant="default" disabled={true} onClick={() => setFloatingWindowOpen(true)}>
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