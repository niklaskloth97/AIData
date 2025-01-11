"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { createFileColumns } from "./columns"; // Corrected import
import useMockFiles from "@/hooks/api/useMockFiles"; // Correct hook
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";

export default function FilesContent() {
  const { data, isLoading, error } = useMockFiles();
  const tableData = data ?? [];
  const [globalFilter, setGlobalFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  // Define file type options
  const fileTypeOptions = [
    { value: "all", label: "All File Types" },
    { value: "csv", label: "CSV" },
    { value: "txt", label: "TXT" },
    { value: "pdf", label: "PDF" },
    { value: "doc", label: "DOC" },
    { value: "xls", label: "XLS" },
    { value: "json", label: "JSON" },
  ];

  // Filter data based on file type
  const filteredData =
    fileTypeFilter === "all"
      ? tableData
      : tableData.filter((file) => file.fileType.toLowerCase() === fileTypeFilter);

  return (
    <div className="space-y-4">
      {/* Dropdown and Search Bar */}
      <div className="flex items-center space-x-4">
        {/* Dropdown for File Type */}
        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select File Type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <input
          type="text"
          className="w-72 border border-gray-300 rounded-md px-3 py-2 text-sm" // Set fixed width
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Data Table */}
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
          data={filteredData} // Pass filtered data
          globalFilter={globalFilter}
        />
      )}
    </div>
  );
}
