"use client";
import { useState } from "react";
import React from "react";
import { DataTable } from "@/components/DataTable";
import { createColumns, MappingData } from "./columns";
import { createBrowserColumns, BrowserTableData } from "./database-browser-columns";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import useMockWorkbenchMappingEditor from "@/hooks/api/useMockWorkbenchMappingEditor";
import useMockTableBrowser from "@/hooks/api/useMockTableBrowser";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";

export default function Page() {
    const { isLoading: isLoadingEditor, data: editorData } = useMockWorkbenchMappingEditor();
    const { isLoading: isLoadingBrowser, data: browserData } = useMockTableBrowser();
    const [mappings, setMappings] = useState<MappingData[]>([]);
    const [editorFilter, setEditorFilter] = useState("");
    const [browserFilter, setBrowserFilter] = useState("");

    React.useEffect(() => {
        if (editorData?.mappings) {
            setMappings(editorData.mappings);
        }
    }, [editorData]);

    const handleDelete = (index: number) => {
        setMappings(mappings.filter((_, i) => i !== index));
    };

    const addNewColumn = () => {
        const newMapping: MappingData = {
            displayName: "",
            timestamp: "",
            eventType: "",
            otherAttributes: "",
        };
        setMappings([...mappings, newMapping]);
    };

    const handleContinue = () => {
        console.log("Current Mappings State:", mappings);
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
        onDelete: handleDelete 
    });

    return (
        <div className="p-6 space-y-8">
            {/* First Table Section */}
            <div>
              <div className="justify-between">
                  <PageHeader
                      heading="Mapping Editor"
                      subtext="Define your event log structure"
                  />
                  <div className="mb-4">
                      <Button variant={"secondary"} onClick={addNewColumn}>Add New Column</Button>
                  </div>
                  <SelectNSearchTable 
                      globalFilter={editorFilter}
                      setGlobalFilter={setEditorFilter}
                      selectButton="Select Column Type"
                  />
                  
                </div>
                <DataTable 
                    columns={columns} 
                    data={mappings}
                    globalFilter={editorFilter}
                />
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
                        data={browserData?.tables ?? []}
                        globalFilter={browserFilter}
                    />
                )}
            </div>

            <div className="mt-6 flex justify-between">
                <Button variant="secondary">Back</Button>
                <Button onClick={handleContinue}>Continue</Button>
            </div>
        </div>
    );
}