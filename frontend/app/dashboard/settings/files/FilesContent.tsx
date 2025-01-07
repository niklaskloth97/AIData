"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { createFileColumns } from "./columns"; // Corrected import
import useMockFiles from "@/hooks/api/useMockFiles"; // Correct hook
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { Loader } from "lucide-react";

export default function FilesContent() {
  const { data, isLoading, error } = useMockFiles();
  const tableData = data ?? [];
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <>
      <SelectNSearchTable
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectButton="Select File Type"
      />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">
          Failed to load files. Please try again later.
        </p>
      ) : (
        <DataTable
          columns={createFileColumns} // Correct columns for files
          data={tableData}
          globalFilter={globalFilter}
        />
      )}
    </>
  );
}
