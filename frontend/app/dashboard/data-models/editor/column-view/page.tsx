"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFloatingWindow } from "@/components/TableFloatingWindow";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { useRouter, useSearchParams } from "next/navigation";
import useTableColumn, { ColumnData } from "@/hooks/api/useTableColumn";
import { Input } from "@/components/ui/input";

export default function Page() {
    const searchParams = useSearchParams();
    const targetTable = searchParams.get("targetTable") ?? "NO QUERY PRESENT";
    const targetTableName = searchParams.get("targetTableName") ?? "NO QUERY PRESENT";
    const router = useRouter();

    const { isLoading, data } = useTableColumn(targetTable);
    const [columnData, setColumnData] = useState<ColumnData[]>([]);
    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Load initial data
    useEffect(() => {
        setColumnData(data ?? []);
        console.log(data);
    }, [data]);

    return (
        <>
            <PageHeader
                heading={`Data Model Editor for ${targetTableName} table`}
                subtext={`Inspect the columns of the ${targetTableName} table.`}
            />

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="">
                    <Input
                        placeholder="Search..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="m-4"></div>
                    <DataTable
                        data={columnData ?? []}
                        columns={columns}
                        globalFilter={globalFilter}
                        setData={setColumnData}
                    />
                </div>
            )}

            <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => router.back()}>
                    Back to Data Model
                </Button>
                {/* <Button
                    variant="default"
                    disabled={true}
                    onClick={() => setFloatingWindowOpen(true)}
                >
                    Continue
                </Button> */}
            </div>

            <TableFloatingWindow
                isOpen={floatingWindowOpen}
                onClose={() => setFloatingWindowOpen(false)}
            />
        </>
    );
}
