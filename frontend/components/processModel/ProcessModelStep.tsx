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
import { Step } from "@/hooks/api/useProcessModel";

export default function ProcessModelStep({
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
    onEdit: (params: { id: number; description?: string; name?: string; }) => void;
    isEditing: boolean;
    toggleEditMode: () => void;
}) {
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
                <div className="flex-1 gap-2 mr-2">
                    <input
                        type="text"
                        value={step.name}
                        onChange={(e) => onEdit({id, name: e.target.value})}
                        className="flex-1 border rounded-md px-2 py-1 w-full font-semibold"
                    />
                    <br />
                    <input
                        type="text"
                        value={step.description}
                        onChange={(e) => onEdit({id, description: e.target.value})}
                        className="flex-1 border rounded-md px-2 py-1 w-full"
                    />
                </div>
            ) : (
                <div className="flex-1">
                    <span className="flex-1 font-semibold">{step.name}</span>
                    <br />
                    <span className="flex-1">{step.description}</span>
                </div>
            )}
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <button
                        className="flex items-center justify-center border border-green-300 rounded-full p-2 hover:bg-green-100"
                        onClick={toggleEditMode}
                        aria-label="Save"
                    >
                        <FaCheck className="text-green-600" />{" "}
                        {/* Save button updated */}
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
}
