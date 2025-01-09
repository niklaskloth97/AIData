"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
// Adjust this import path as needed:
import PageHeader from "@/components/PageHeader"; 

export default function FileUploadBox() {
  // Track whether user has uploaded
  const [uploaded, setUploaded] = useState(false);
  // Track whether we’re mid-upload
  const [uploading, setUploading] = useState(false);
  // Our own local state for files
  const [files, setFiles] = useState<File[]>([]);

  // Called when user drops or selects files
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("Dropped files:", acceptedFiles);
      // Merge new files into our existing list
      setFiles((current) => [...current, ...acceptedFiles]);
    },
    [setFiles]
  );

  // Set up react-dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // We'll manage "click to select" with 'open()'
  });

  // Remove a file from our local list
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((curr) => curr.filter((file) => file !== fileToRemove));
  };

  // Called when user clicks "Upload"
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("No files selected!");
      return;
    }

    try {
      setUploading(true);

      // Build FormData
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      // Fake fetch request (simulate a 1-second upload)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUploaded(true);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Allow user to add more files after they’ve uploaded
  const handleAddMoreFiles = () => {
    setUploaded(false);
  };

  // “Done” could navigate away or close a modal, etc.
  const handleDone = () => {
    alert("Done pressed. Navigate away or close modal, etc.");
  };

  // Create a file list with remove buttons
  const filesList = files.map((file) => {
    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : null;

    return (
      <li key={file.name} className="text-sm text-gray-600 mb-2 flex items-center">
        {isImage && (
          <img
            src={preview as string}
            alt={file.name}
            className="w-16 h-16 object-cover mr-2"
          />
        )}
        <div className="flex-1">
          {file.name} - {(file.size / 1024).toFixed(2)} KB
        </div>
        {!uploaded && (
          <button
            onClick={() => handleRemoveFile(file)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        )}
      </li>
    );
  });

  return (
    <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow flex flex-col min-h-[500px] w-full">
      {/* PageHeader reused here */}
      <PageHeader
        heading="Upload files"
        subtext="Upload database extracted tables here"
      />

      {/* If not uploaded, show dropzone; if uploaded, show success box */}
      {!uploaded ? (
        <div className="flex-1 flex flex-col">
          {/* The drop area */}
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center flex-1 
                        border-1 border rounded-md cursor-pointer 
                        p-6 transition-colors
                        ${
                          isDragActive
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-gray-400" 
                        }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="text-4xl mb-2">⬆️</div>
              {isDragActive ? (
                <p className="font-semibold text-gray-700">Drop the files here...</p>
              ) : (
                <p className="font-semibold text-gray-700">
                  Drag &amp; drop files here or{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={open}
                  >
                    click
                  </span>{" "}
                  to select
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: XLS, XLSX, CSV | Max: 25MB
              </p>
            </div>
          </div>

          {/* Show the file list & remove buttons */}
          {filesList.length > 0 && <ul className="mt-3 list-none">{filesList}</ul>}
        </div>
      ) : (
        // Uploaded state: Show a bigger success area
        <div className="flex-1 flex flex-col items-center text-center p-6 bg-green-50 rounded-md shadow">
          {/* Large check icon */}
          <svg
            className="w-16 h-16 text-green-500 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-2xl font-bold text-green-700">Success!</h3>
          <p className="text-gray-700 mt-2">
            Your files were uploaded successfully.
          </p>

          {/* File list (if any) */}
          {filesList.length > 0 && (
            <ul className="mt-6 list-none w-full max-w-md text-left">{filesList}</ul>
          )}
        </div>
      )}

      {/* Footer: either "Upload" or "Manage Files / Done" */}
      <div className="mt-4 flex gap-2">
        {!uploaded ? (
          <Button
            // Same burgundy red as your "Test Connection"
            variant="default" className="w-full"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        ) : (
          <>
            <Button
              className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={handleAddMoreFiles}
            >
              Manage Files
            </Button>
            <Button
              // Also burgundy red, half width
               variant="default" className="w-full"
              onClick={handleDone}
            >
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
