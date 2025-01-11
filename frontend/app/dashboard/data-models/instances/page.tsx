"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns, InstanceData } from "./columns";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import useDataModelInstances from "@/hooks/api/useDataModelInstances";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { Button } from "@/components/ui/button";
import { DeleteConfirmWindow } from "@/components/DeleteConfirmWindow";

export default function Page() {
    const { isLoading, data } = useDataModelInstances();
    const [globalFilter, setGlobalFilter] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        console.log("Deleting instance:", id);
        setDeleteConfirmOpen(false);
    };

    // Create columns with options
    const tableColumns = columns({ onDelete: handleDelete });

    return (
        <div>
            <PageHeader
                heading="Data Model Instances"
                subtext="Manage your test data instances"
            />
            <SelectNSearchTable 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectButton="Select Instance"
            />
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <DataTable 
                    columns={tableColumns}  // Pass created columns
                    data={data ?? []}
                    globalFilter={globalFilter}
                />
            )}
        </div>
    );
}