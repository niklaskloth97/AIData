"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import useMockCaseIDTables from "@/hooks/api/useMockCaseIDTables";
import { useWorkflow } from '../workflowContext';
import { TableData } from "./columns";


// FloatingWindowComponent
const FloatingWindow = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-96">
                <h2 className="text-xl font-bold mb-4">
                    Additional Information
                </h2>
                <p>Details about the selected item can go here.</p>
                <Button variant="default" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
};

const CaseIDBuilderPage = () => {
    const { isLoading, data } = useMockCaseIDTables();
    const mockData = data ?? [];
    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedMappings, setSelectedMappings] = useState<TableData[]>([]);
    const { nextStep, previousStep } = useWorkflow();


    

    const handleContinue = () => {
        if (selectedMappings.length > 0) {
            sessionStorage.setItem('caseIdMappings', JSON.stringify(selectedMappings));
            nextStep();
        }
    };

    const handleBack = () => {
        previousStep();
    };

    // Load selected rows when table selection changes
    const handleSelectionChange = (selectedRows: TableData[]) => {
        console.log("Selection changed:", selectedRows); // Debug log
        setSelectedMappings(selectedRows);
    };


    return (
        <>
            <PageHeader
                heading={"Workbench - Case ID Builder"}
                subtext={"Select the Case ID definition for the event log and choose the tables to be considered going forward with their respective reference to the Case ID."}
            />
            <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center space-x-4">
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

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={mockData}
                    globalFilter={globalFilter}
                    onSelectionChange={handleSelectionChange}  // Add this prop
                />
            )}

            <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={handleBack}>
                    Back
                </Button>
                <Button 
                    variant="default" 
                    onClick={handleContinue}
                    disabled={selectedMappings.length === 0} 
                >
                    Continue
                </Button>
            </div>

            <FloatingWindow isOpen={floatingWindowOpen} onClose={() => setFloatingWindowOpen(false)} />
        </>
    );
};

export default CaseIDBuilderPage;
