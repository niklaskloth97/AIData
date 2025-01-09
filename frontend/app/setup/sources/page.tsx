"use client";
import React from "react";
import { Button } from "@/components/ui/button";


// Import the two boxes
import FileUploadBox from "./FileUpload";
import DatabaseSetupBox from "./DatabaseSetup";

function handleProceed() {
  window.location.href = "/dashboard";
  }

export default function UploadDatabase() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center w-full max-w-6xl gap-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left: File Upload */}
          <FileUploadBox />

          {/* Right: Database Setup */}
          <DatabaseSetupBox />
        </div>

        {/* Proceed to Model Editor Button */}
        <div className="w-full flex justify-end mt-2">
          <Button variant="default" onClick={handleProceed}>
             
              Proceed to model editor
          </Button>workbench
        </div>
      </div>
    </div>
  );
}