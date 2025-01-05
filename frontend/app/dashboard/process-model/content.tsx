"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaTrash, FaGripVertical, FaCheck } from "react-icons/fa";
import ProcessModelStep from "@/components/processModel/ProcessModelStep";
import useProcessModel from "@/hooks/api/useProcessModel";

interface Step {
  id: number;
  text: string;
}

export interface ProcessModelData {
  processName: string;
  description: string;
  steps: Step[];
}

const ProcessModelContent = () => {
  const {data, isLoading} = useProcessModel();

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setSteps(data.steps);
      setProcessName(data.processName);
      setProcessDescription(data.description);
    }
  }, [data]);

  const [steps, setSteps] = useState<Step[]>(data?.steps ?? []);
  const [processName, setProcessName] = useState<string>(data?.processName ?? "");
  const [processDescription, setProcessDescription] = useState<string>(data?.description ?? "");

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

  const handleEdit = (id: number, text: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, text } : step
      )
    );
  };

  const toggleEditMode = (id: number) => {
    setEditingStep((prev) => (prev === id ? null : id));
  };

  return (
    <div className="px-0 mt-6 max-w-full"> {/* Adjusted styling */}
      {/* Process Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Process Name</label>
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
        <label className="block font-semibold mb-2">Process Description</label>
        <textarea
          value={processDescription}
          onChange={(e) => setProcessDescription(e.target.value)}
          placeholder="Enter description here"
          className="w-full border rounded-md px-3 py-2"
          rows={3}
        />
      </div>

      {/* Process Steps */}
      <div>
        <h2 className="block font-semibold mb-4">Process Steps</h2>
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
                toggleEditMode={() => toggleEditMode(step.id)}
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
                { id: Date.now(), text: `New Step` },
              ])
            }
          >
            +
          </button>
          <div className="my-2"/>
            <button
            className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() =>
              console.log({processName, processDescription, steps})
            }
            >
            Print state
            </button>
          <div className="my-2"/>
            <button
            className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() =>
              alert("Not implemented")
            }
            >
            Upload to backend
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessModelContent;
