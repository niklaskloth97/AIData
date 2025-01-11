"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { createDatabaseColumns } from "./columns";
import useMockDatabases from "@/hooks/api/useMockDatabases";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";

export default function DatabasesContent() {
  const { data, isLoading, error } = useMockDatabases();
  const tableData = data ?? [];
  const [globalFilter, setGlobalFilter] = useState("");
  const [databaseFilter, setDatabaseFilter] = useState("all");

  // Define database options for dropdown
  const databaseOptions = [
    { value: "all", label: "All Databases" },
    ...Array.from(new Set(tableData.map((db) => ({ value: db.databaseName, label: db.databaseName })))),
  ];

  // Filtered data based on dropdown and search
  const filteredData =
    databaseFilter === "all"
      ? tableData
      : tableData.filter((db) => db.databaseName === databaseFilter);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Dropdown */}
        <Select value={databaseFilter} onValueChange={setDatabaseFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select Database" />
          </SelectTrigger>
          <SelectContent>
            {databaseOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <input
          type="text"
          className="w-72 border border-gray-300 rounded-md px-3 py-2 text-sm" // Consistent width
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
          Failed to load databases. Please try again later.
        </p>
      ) : (
        <DataTable
          columns={createDatabaseColumns} // Correct columns for databases
          data={filteredData} // Apply filtered data
          globalFilter={globalFilter}
        />
      )}
    </div>
  );
}
