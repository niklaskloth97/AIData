"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns, TableData } from "./columns";
import { DataTable } from "@/components/data-table";

// FloatingWindowComponent
const FloatingWindow = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Additional Information</h2>
        <p>Details about the selected item can go here.</p>
        <Button variant="default" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const tableData: TableData[] = [
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "BKPF",
    referenceColumn: "ORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
  {
    tableName: "EBKE2222",
    referenceColumn: "RefORDERID",
    description: "Helps identify the type of action performed during the change event",
  },
];


const CaseIDBuilderPage = () => {
  const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <>
    <h1 className="text-2xl font-bold">Workbench - Case ID Builder</h1>
          <p className="mb-6 text-gray-600">Select the Case ID definition for the event log and choose the tables to be considered going forward with their respective reference to the Case ID.</p>
          <div className="flex items-center mb-4 space-x-4">
            <div className="flex items-center space-x-4">
              {/* <label htmlFor="caseId" className="text-sm font-medium text-gray-700">Select the preferred Case ID</label> */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Case ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OrderID">OrderID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <DataTable columns={columns} data={tableData} globalFilter={globalFilter}></DataTable>
          
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => alert("Going back")}>Back</Button>
            <Button variant="default" onClick={() => setFloatingWindowOpen(true)}>Continue</Button>
          </div>

          <FloatingWindow isOpen={floatingWindowOpen} onClose={() => setFloatingWindowOpen(false)} />
      </>
  );
};

export default CaseIDBuilderPage;
