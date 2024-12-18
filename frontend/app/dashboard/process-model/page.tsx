"use client";


import React, { useState } from "react";

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
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-2">New Page</h1>
      <p className="text-gray-500 mb-6">View and manage your content here.</p>

      {/* Title and Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter title here"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          placeholder="Enter description here"
          className="w-full border rounded-md px-3 py-2"
          rows={3}
        />
      </div>

      {/* Steps */}
      <h2 className="font-bold text-xl mb-2">Steps</h2>
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
                className="flex items-center justify-center border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100"
                onClick={() => alert("Edit functionality not implemented yet")}
              >
                <img src="/edit-icon.png" alt="Edit" className="w-4 h-4 mr-1" />
                Edit
              </button>

              <button
                className="flex items-center justify-center border border-red-300 rounded-md px-3 py-1 text-red-600 hover:bg-red-100"
                onClick={() => handleDelete(step.id)}
              >
                <img
                  src="/delete-icon.png"
                  alt="Delete"
                  className="w-4 h-4 mr-1"
                />
                Delete
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
  );
};

export default NewPage;
