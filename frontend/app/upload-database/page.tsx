"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadDatabase() {
  const [file, setFile] = useState<File | null>(null);
  const [dbType, setDbType] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setFile(uploadedFile || null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex flex-col items-center w-full max-w-6xl gap-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* File Upload Section */}
          <div className="bg-white shadow-md rounded-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">Upload files</h2>
              <p className="text-gray-500 mb-4">
                Upload database extracted tables here
              </p>
              {/* Larger Dotted Box */}
              <div className="border-dashed border-4 border-gray-700 rounded-lg h-64 flex justify-center items-center">
                <label
                  htmlFor="file-upload"
                  className="text-gray-700 text-base font-semibold text-center cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">⬆️</span>
                    Drag and Drop file here or{" "}
                    <span className="text-blue-600 underline">Choose file</span>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Supported formats: XLS, XLSX, CSV | Max: 25MB
              </p>
            </div>
            <Button className="w-full mt-4">Upload</Button>
          </div>

          {/* Database Setup Section */}
          <div className="bg-white shadow-md rounded-md p-6 flex flex-col justify-between">
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Add Database</h2>
              <p className="text-gray-500 text-sm">Upload your database</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  Postgres Prod 1
                </span>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  <span className="text-gray-700 text-lg">+</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="db-display-name">Database Display Name</Label>
                <Input id="db-display-name" placeholder="dbdisplayname" />
              </div>
              <div>
                <Label htmlFor="db-type">Database Type</Label>
                <Select onValueChange={setDbType}>
                  <SelectTrigger id="db-type">
                    <SelectValue placeholder="Select a database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgres">Postgres</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="username">User Name</Label>
                <Input id="username" placeholder="dbuser" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="dbpassword"
                />
              </div>
              <div>
                <Label htmlFor="hostname">Hostname</Label>
                <Input id="hostname" placeholder="dbhost" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" placeholder="dbport" />
                </div>
                <div>
                  <Label htmlFor="dbname">Database Name</Label>
                  <Input id="dbname" placeholder="dbname" />
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">Test Connection</Button>
          </div>
        </div>

        {/* Proceed to Model Editor Button */}
        <div className="w-full flex justify-end mt-4">
          <Button className="w-auto bg-red-600 hover:bg-red-700 text-white">
            Proceed to model editor 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
