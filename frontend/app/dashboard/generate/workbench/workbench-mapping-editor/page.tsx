"use client";
import { useState, useEffect } from "react";
import React from "react";
import { DataTable, useSkipper } from "@/components/DataTable";
import { createColumns } from "./columns";
import { createBrowserColumns } from "./database-browser-columns";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { Loader, PlusCircle } from "lucide-react";
import useMockWorkbenchMappingEditor from "@/hooks/api/useWorkbenchMappingEditor";
import useMockTableBrowser from "@/hooks/api/useMockTableBrowser";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { useWorkflow } from "../workflowContext";
import usePossibleMappings, {
    PossibleMapping,
} from "@/hooks/api/usePossibleMappings";

export default function Page() {
    const { nextStep, previousStep } = useWorkflow();
    const { isLoading: isLoadingPossibleMappings, data: possibleMappingData } =
        usePossibleMappings();
    const { isLoading: isLoadingEditor, data: editorData } =
        useMockWorkbenchMappingEditor();
    const { isLoading: isLoadingBrowser, data: browserTableData } =
        useMockTableBrowser();
    const [mappings, setMappings] = useState<PossibleMapping[]>([]);
    const [editorFilter, setEditorFilter] = useState("");
    const [browserFilter, setBrowserFilter] = useState("");
    // const [selectedMappings, setSelectedMappings] = useState<MappingData[]>([]);
    const [autoResetPageIndexMappings, skipAutoResetPageIndexMappings] =
        useSkipper();

    // Load initial data
    useEffect(() => {
        // const saved = sessionStorage.getItem('workbenchMappings');
        // if (saved) {
        //     const { mappings: savedMappings } = JSON.parse(saved);
        //     // Merge saved column values with mapping structure
        //     const restoredMappings = savedMappings.map((mapping: MappingData, index: number) => ({
        //         ...mapping,
        //         // ...columnValues[index]
        //     }));
        //     setMappings(restoredMappings);
        // } else if (editorData?.mappings) {
        //     setMappings(editorData.mappings);
        // }
        setMappings(possibleMappingData ?? []);
    }, [possibleMappingData]);

    const handleDelete = (index: number) => {
        const newMappings = mappings.filter((_, i) => i !== index);
        setMappings(newMappings); // Only update local state
    };

    const addNewColumn = () => {
        const newMapping: PossibleMapping = {
            id: mappings.length,
            displayName: "",
            timestampColumn: "",
            eventType: "",
            involvedTable: "",
            possibleAttributes: [],
            // otherAttributes: [],
        };
        setMappings([...mappings, newMapping]); // Only update local state
    };

    const handleContinue = () => {
        if (mappings.length > 0) {
            // Save to session storage when continuing
            // sessionStorage.setItem(
            //     "workbenchMappings",
            //     JSON.stringify({
            //         mappings: mappings,
            //         columnValues: mappings.map(mapping => ({
            //             displayName: mapping.displayName,
            //             timestamp: mapping.timestamp,
            //             eventType: mapping.eventType,
            //             otherAttributes: mapping.otherAttributes
            //         }))
            //     })
            // );
            // Send data to backend
            
            nextStep();
        }
    };

    function prepareSave(){
        return []
    }

    const handleBack = () => {
        previousStep();
    };

    if (isLoadingEditor || !editorData) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const columns = createColumns({
        ...editorData.options,
        onDelete: handleDelete,
    });

    return (
        <div>
            {/* First Table Section */}
            <div>
                <div className="justify-between">
                    <PageHeader
                        heading="Mapping Editor"
                        subtext="Define your event log structure"
                    />
                    {/* <div className="mb-4">
                      <Button variant={"outline"} onClick={addNewColumn}>
                        <PlusCircle />
                        Add New Column</Button>
                  </div> */}
                    {/* <SelectNSearchTable 
                      globalFilter={editorFilter}
                      setGlobalFilter={setEditorFilter}
                      selectButton="Select Column Type"
                  /> */}
                </div>
                <DataTable
                    columns={columns}
                    data={mappings}
                    setData={setMappings}
                    globalFilter={editorFilter}
                    autoResetPageIndex={autoResetPageIndexMappings}
                    skipAutoResetPageIndex={skipAutoResetPageIndexMappings}
                />
            </div>

            <div className="mt-2 mb-6 flex justify-between">
                <Button variant="secondary" onClick={handleBack}>
                    Back
                </Button>
                <Button variant="outline" onClick={() => console.log(mappings)}>
                    Log Mappings
                </Button>
                <Button
                    variant="default"
                    onClick={handleContinue}
                    disabled={mappings.length === 0}
                >
                    Continue
                </Button>
            </div>

            {/* Second Table Section */}
            <div>
                <PageHeader
                    heading="Table Browser"
                    subtext="Check the databases for suitable log tables"
                />
                <SelectNSearchTable
                    globalFilter={browserFilter}
                    setGlobalFilter={setBrowserFilter}
                    selectButton="Select Database"
                />

                {isLoadingBrowser ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <Loader className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <DataTable
                        columns={createBrowserColumns}
                        data={browserTableData ?? []}
                        globalFilter={browserFilter}
                    />
                )}
            </div>
        </div>
    );
}
