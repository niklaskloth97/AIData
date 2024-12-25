"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Step {
  id: number;
  text: string;
}

const NewPage = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, text: "Step 1: Define your step here" },
    { id: 2, text: "Step 2: Add another step" },
  ]);

  // Function to handle deleting a step
  const handleDelete = (id: number) => {
    const updatedSteps = steps.filter((step) => step.id !== id);
    setSteps(updatedSteps);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Frame */}
      <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-white">
        {/* Page Header */}
        <h1 className="font-bold text-xl mb-1">Process Model</h1>
        <p className="text-gray-500 mb-4">View and manage your process model.</p>

        {/* Title and Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Process Name</label>
          <input
            type="text"
            placeholder="Enter title here"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Process Description</label>
          <textarea
            placeholder="Enter description here"
            className="w-full border rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        {/* Steps */}
        <h2 className="block font-semibold mb-1">Process Steps</h2>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between border rounded-md px-4 py-2"
            >
              {/* Step Text */}
              <span>{step.text}</span>

              {/* Edit and Delete Buttons */}
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center border border-gray-300 rounded-full p-2 hover:bg-gray-100"
                  onClick={() => alert("Edit functionality not implemented yet")}
                  aria-label="Edit"
                >
                  <FaEdit className="text-gray-600" />
                </button>

                <button
                  className="flex items-center justify-center border border-red-300 rounded-full p-2 hover:bg-red-100"
                  onClick={() => handleDelete(step.id)}
                  aria-label="Delete"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Step Button */}
        <div className="mt-6">
          <button
            className="w-full border rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() =>
              setSteps([...steps, { id: Date.now(), text: "New Step" }])
            }
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPage;
