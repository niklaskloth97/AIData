"use client";

import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaTrash, FaGripVertical, FaCheck } from "react-icons/fa";

interface Step {
  id: number;
  text: string;
}

const SortableItem = ({
  id,
  step,
  onDelete,
  onEdit,
  isEditing,
  toggleEditMode,
}: {
  id: number;
  step: Step;
  onDelete: () => void;
  onEdit: (id: number, text: string) => void;
  isEditing: boolean;
  toggleEditMode: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "12px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded-md px-4 py-2 bg-white shadow-sm"
    >
      <div
        className={`flex items-center cursor-grab ${
          isEditing ? "pointer-events-none" : ""
        }`}
        {...(isEditing ? {} : listeners)} // Enable drag-and-drop only when not editing
        {...attributes}
      >
        <FaGripVertical className="text-gray-400 mr-3" />
      </div>
      {isEditing ? (
        <input
          type="text"
          value={step.text}
          onChange={(e) => onEdit(id, e.target.value)}
          className="flex-1 border rounded-md px-2 py-1 w-full"
        />
      ) : (
        <span className="flex-1">{step.text}</span>
      )}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <button
            className="flex items-center justify-center border border-green-300 rounded-full p-2 hover:bg-green-100"
            onClick={toggleEditMode}
            aria-label="Save"
          >
            <FaCheck className="text-green-600" /> {/* Save button updated */}
          </button>
        ) : (
          <button
            className="flex items-center justify-center border border-gray-300 rounded-full p-2 hover:bg-gray-100"
            onClick={toggleEditMode}
            aria-label="Edit"
          >
            <FaEdit className="text-gray-600" />
          </button>
        )}
        <button
          className="flex items-center justify-center border border-red-300 rounded-full p-2 hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete"
        >
          <FaTrash className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

const ProcessModelContent = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, text: "Step 1: Define your step here" },
    { id: 2, text: "Step 2: Add another step" },
  ]);

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
          placeholder="Enter title here"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Process Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Process Description</label>
        <textarea
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
              <SortableItem
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
        </div>
      </div>
    </div>
  );
};

export default ProcessModelContent;
