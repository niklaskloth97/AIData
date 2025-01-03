"use client";
import React, { useState } from 'react';
import Footer from "@/components/footer";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
  } from "@/components/ui/select"

export function AdapterSelection() {
  const [selectedAdapter, setSelectedAdapter] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Adapter Selection Form */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white shadow-lg rounded-md w-full max-w-lg p-8">
          <h2 className="text-2xl font-bold text-left text-black-700">Select Adapter</h2>
          <p className="text-sm text-left pb-4 text-gray-600">The Adapter will provide the AI with additional knowledge to ensure good results.</p>
            <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="adapter">Adapter</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Adapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Supported Adapters</SelectLabel>
                        <SelectItem value="sap-adapter">SAP Table Adapter</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Continue with selected Adapter</Button>
                <Button type="submit" className="w-full" variant="destructive">
                  Continue without Adapter</Button>
              </div>
          </div>
        </div>
      </div>
  );
};

export default AdapterSelection;