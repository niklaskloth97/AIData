"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { createDatabaseColumns } from "./columns";
import useMockDatabases from "@/hooks/api/useMockDatabases";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { Loader } from "lucide-react";

export default function DatabasesContent() {
  const { data, isLoading, error } = useMockDatabases();
  const tableData = data ?? [];
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <>
      <SelectNSearchTable
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectButton="Select Database"
      />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">
          Failed to load databases. Please try again later.
        </p>
      ) : (
        <DataTable
          columns={createDatabaseColumns}
          data={tableData}
          globalFilter={globalFilter}
        />
      )}
    </>
  );
}
