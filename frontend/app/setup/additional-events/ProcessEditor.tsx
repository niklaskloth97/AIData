"use client";
import React, { use, useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProcessModelStep from "@/components/processModel/ProcessModelStep";
import useProcessModel from "@/hooks/api/useProcessModel";
import { Loader, Plus, PlusCircle, Printer, Save, ArrowRight } from "lucide-react";
import { Step, ProcessData } from "@/hooks/api/useProcessModel";
import useProcessModelMutation from "@/hooks/api/useProcessModelMutation";
import { Button } from "@/components/ui/button";

export default function ProcessEditor({data, isLoading}: {data: ProcessData, isLoading: boolean}) {
    // const { data, isLoading } = useProcessModel();
    const updateProcess = useProcessModelMutation();
    const defaultProcess: ProcessData = {
        id: 0,
        steps: [],
        name: "",
        description: "",
        project_id: 0
    };

    // Update state when data changes
    useEffect(() => {
        if (data) {
            setSteps(data.steps ?? defaultProcess.steps);
            setProcessName(data.name ?? defaultProcess.name);
            setProcessDescription(data.description ?? defaultProcess.description);
        }
    }, [data]);

    const [steps, setSteps] = useState(defaultProcess.steps);
    const [processName, setProcessName] = useState(defaultProcess.name);
    const [processDescription, setProcessDescription] = useState(defaultProcess.description);

    const [editingStep, setEditingStep] = useState<number | null>(null);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = steps.findIndex((step) => step.id === active.id);
            const newIndex = steps.findIndex((step) => step.id === over.id);

            setSteps((steps) => arrayMove(steps, oldIndex, newIndex));
        }
    };

    const handleDelete = (id: number) => {
        setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
    };

    const handleEdit = ({id, description, name}: { id: number, description?: string, name?: string }) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) => (step.id === id ? { ...step, ...(description && {description}), ...(name && {name}) } : step))
        );
    };

    const toggleEditMode = (id: number) => {
        setEditingStep((prev) => (prev === id ? null : id));
    };

    function handleSave(){
        console.log({
            processName,
            processDescription,
            steps,
        });
        updateProcess.mutate({
            id: data?.id ?? 0,
            name: processName,
            description: processDescription,
            steps: steps,
            project_id: data?.project_id ?? 0
        });
    }

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-1/2">
                    <Loader className="animate-spin" />
                </div>
            ) : (
                <div className="px-0 h-full max-w-full flex flex-col">
                    {/* Adjusted styling */}
                    {/* Process Name */}
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">
                            Process Name
                        </label>
                        <input
                            type="text"
                            value={processName}
                            onChange={(e) => setProcessName(e.target.value)}
                            placeholder="Enter title here"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    {/* Process Description */}
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">
                            Process Description
                        </label>
                        <textarea
                            value={processDescription}
                            onChange={(e) =>
                                setProcessDescription(e.target.value)
                            }
                            placeholder="Enter description here"
                            className="w-full border rounded-md px-3 py-2"
                            rows={3}
                        />
                    </div>
                    {/* Process Steps */}
                    {/* <div > */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Process Steps</h2>
                            <Button variant="outline" onClick={() =>
                                setSteps([
                                    ...steps,
                                    { 
                                        id: Date.now(), 
                                        name: `New Step`, 
                                        description: "New Step description", 
                                        projectProcess_id: data?.project_id ?? 0, 
                                        tablesInvolved: "" 
                                    },
                                ])
                            }>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Step
                            </Button>
                        </div>
                        <div className="flex flex-col overflow-y-auto h-full">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={steps.map((step) => step.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {steps.map((step) => (
                                    <ProcessModelStep
                                        key={step.id}
                                        id={step.id}
                                        step={step}
                                        onDelete={() => handleDelete(step.id)}
                                        onEdit={handleEdit}
                                        isEditing={editingStep === step.id}
                                        toggleEditMode={() =>
                                            toggleEditMode(step.id)
                                        }
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                        </div>

                        {/* Add New Step Button */}
                        <div className="flex justify-end items-center my-4">
                            <div className="flex space-x-2">
                                <Button variant={"outline"} onClick={() => console.log({
                                    processName,
                                    processDescription,
                                    steps,
                                })}>
                                    <Printer className="h-4 w-4" />
                                    Print state
                                </Button>
                                <Button variant={"outline"} onClick={() => handleSave()}>
                                    <Save className="h-4 w-4" />
                                    Save to backend
                                </Button>
                                <Button variant={"default"} onClick={() => handleSave()}>
                                    <ArrowRight className="h-4 w-4" />
                                    Save and Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                // </div>
            )}
        </>
    );
}