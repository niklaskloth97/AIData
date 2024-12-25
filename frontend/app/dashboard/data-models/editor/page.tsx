"use client"
import { DataTable } from "@/components/DataTable";
import { columns, TableData } from "./columns";

export default function editor() {
    const mockData: TableData[] = [
        {
            tableName: "BKPF",
            referenceColumn: "ORDERID",
            description: "Helps identify the type",
        },
        {
            tableName: "BKPF",
            referenceColumn: "RDERID",
            description: "Helps identify the type",
        }
    ];

    return (
        <>
            <h1 className="">Hello, Editor page!</h1>

            <DataTable data={mockData} columns={columns} />
        </>
    );
}
