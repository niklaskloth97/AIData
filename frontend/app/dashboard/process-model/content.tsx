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
import { Loader } from "lucide-react";
import { Step, ProcessData } from "@/hooks/api/useProcessModel";
import useProcessModelMutation from "@/hooks/api/useProcessModelMutation";

const ProcessModelContent = () => {
    const { data, isLoading } = useProcessModel();
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
                <div className="flex justify-center items-center h-screen">
                    <Loader className="animate-spin" />
                </div>
            ) : (
                <div className="px-0 mt-6 max-w-full">
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
                    <div>
                        <h2 className="block font-semibold mb-4">
                            Process Steps
                        </h2>
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

                        {/* Add New Step Button */}
                        <div className="mt-6">
                            <button
                                className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
                                onClick={() =>
                                    setSteps([
                                        ...steps,
                                        { id: Date.now(), name: `New Step`, description: "New Step description", projectProcess_id: data?.project_id ?? 0, tablesInvolved: "" },
                                    ])
                                }
                            >
                                +
                            </button>
                            <div className="my-2" />
                            <button
                                className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
                                onClick={() =>
                                    console.log({
                                        processName,
                                        processDescription,
                                        steps,
                                    })
                                }
                            >
                                Print state
                            </button>
                            <div className="my-2" />
                            <button
                                className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
                                onClick={() => handleSave()}
                            >
                                Save to backend
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProcessModelContent;
