"use client";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import useAdditionalEvents, {
    AdditionalEvent,
} from "@/hooks/api/useAdditionalEvents";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import ProcessEditor from "./ProcessEditor";
import useProcessModel, { ProcessData } from "@/hooks/api/useProcessModel";

export default function Page() {
    const { isLoading, data } = useAdditionalEvents();
    const [allData, setAllData] = useState<AdditionalEvent[]>([]);
    const [businessObjects, setBusinessObjects] = useState<string[]>([]);
    const [currentBO, setCurrentBO] = useState<string>("");
    const [currentBOIndex, setCurrentBOIndex] = useState<number>(0);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [hiddenColumns, setHiddenColumns] = useState<VisibilityState>({
        business_object: false,
    });
    const [selectedRows, setSelectedRows] = useState({});
    const [nextDisabled, setNextDisabled] = useState(true);
    const [previousDisabled, setPreviousDisabled] = useState(true);
    const [processEditor, setProcessEditor] = useState(false);
    const { data: processData, isLoading: processIsLoading } = useProcessModel();
    const [enhancedProcessData, setEnhancedProcessData] = useState<ProcessData>();

    useEffect(() => {
        setAllData(data ?? []);
        identifyUniqueBOs();
    }, [data]);

    useEffect(() => {
        if (businessObjects.length > 1) {
            setCurrentBO(businessObjects[0] ?? "No Business Objects found");
            setNextDisabled(false);
        }
    }, [businessObjects]);

    useEffect(() => {
        setColumnFilters([{ id: "business_object", value: currentBO }]);
    }, [currentBO]);

    function identifyUniqueBOs() {
        setBusinessObjects(
            // Find all unique AdditionalEvent.business_object values in allData and save them in businessObjects array
            [...new Set(data?.map((event) => event.business_object))]
        );
    }

    function handleNext() {
        setCurrentBO(businessObjects[currentBOIndex + 1]);
        setCurrentBOIndex(currentBOIndex + 1);
        if (currentBOIndex + 2 === businessObjects.length) {
            setNextDisabled(true);
        }
        setPreviousDisabled(false);
    }

    function handlePrevious() {
        setCurrentBO(businessObjects[currentBOIndex - 1]);
        setCurrentBOIndex(currentBOIndex - 1);
        if (currentBOIndex - 1 === 0) {
            setPreviousDisabled(true);
        }
        setNextDisabled(false);
    }

    function handleContinueProcessEditor(){
        setProcessEditor(true);
        if (processData) {
        setEnhancedProcessData({
            ...processData,
            steps: [
                ...processData.steps,
                ...Object.keys(selectedRows).map((rowId) => ({
                    id: allData[rowId].id + 1000,
                    name: allData[rowId].change_event_name,
                    description: allData[rowId].description,
                    projectProcess_id: processData.id,
                    tablesInvolved: allData[rowId].tablesInvolved,
                })),
            ] 
            }
        );
    }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (processEditor) {
        

        const defaultProcess: ProcessData = {
                id: 0,
                steps: [],
                name: "",
                description: "",
                project_id: 0
        };

        
        return (
            <main className="h-screen w-screen flex flex-col items-center justify-center gap-2 card">
                <div className="flex flex-col w-3/4 h-screen justify-center">
                    <PageHeader
                        heading="Add and Order the Process Steps"
                        subtext="The selected process steps are appended to the existing process steps. You can now edit the process steps and bring them into the correct order."
                    ></PageHeader>
                    <div className="flex flex-col p-4 max-h-[83.333%] gap-4 bg-white rounded-lg border bg-card text-card-foreground shadow">
                        <ProcessEditor 
                            data={enhancedProcessData ?? defaultProcess}
                            isLoading={processIsLoading}
                        />
                    </div>
                    <div className="h-4"></div>
                    <Button
                        variant={"outline"}
                        onClick={() => setProcessEditor(false)}
                    >
                        Back to event selection
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="h-screen w-screen flex flex-col items-center justify-center gap-2 card">
                <div className="flex flex-col w-3/4 h-screen justify-center gap-2 ">
                    <PageHeader
                        heading="Select additional Process Steps"
                        subtext="These are potential additional Process Steps that where identified based on events found your data. Select them for further consideration."
                    ></PageHeader>
                    <div className="flex flex-col p-4 h-4/6 gap-4 bg-white rounded-lg border bg-card text-card-foreground shadow">
                        <div className="flex gap-1">
                            Select additional Process Steps from{" "}
                            <span className="font-md">{currentBO}</span>
                        </div>
                        <DataTable
                            columns={columns}
                            data={allData}
                            setData={setAllData}
                            columnFilters={columnFilters}
                            columnVisibility={hiddenColumns}
                            myRowSelection={selectedRows}
                            mySetRowSelection={setSelectedRows}
                        ></DataTable>
                        <div className="flex justify-between">
                            <Button
                                variant={"outline"}
                                disabled={previousDisabled}
                                onClick={handlePrevious}
                            >
                                Previous Business Object
                            </Button>
                            {currentBOIndex === businessObjects.length - 1 ? (
                                <Button onClick={() => handleContinueProcessEditor()}>
                                    Continue to process design
                                </Button>
                            ) : (
                                <Button
                                    disabled={nextDisabled}
                                    onClick={handleNext}
                                    variant={"outline"}
                                >
                                    Next Business Object
                                </Button>
                            )}
                        </div>
                        {/* <Button
                            variant={"outline"}
                            onClick={() => console.log(businessObjects)}
                        >
                            Print business_objects
                        </Button>
                        <Button
                            variant={"outline"}
                            onClick={() => console.log(allData)}
                        >
                            Print allData
                        </Button>
                        <Button
                            variant={"outline"}
                            onClick={() => console.log(selectedRows)}
                        >
                            Print rowSelect
                        </Button> */}
                    </div>
                </div>
            </main>
        </>
    );
}
