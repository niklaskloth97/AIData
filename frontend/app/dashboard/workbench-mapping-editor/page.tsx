"use client";
import React from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { columns, MappingData } from "./columns";

const sampleData: MappingData[] = [
  {
    displayName: "Address Changing",
    timestamp: "Select a column",
    eventType: "Address_changed",
    otherAttributes: "Select a column",
  },
  {
    displayName: "Delivery Attempt",
    timestamp: "Select a column",
    eventType: "Create / Select",
    otherAttributes: "employee_id, time_taken",
  },
  {
    displayName: "Payment Stripe",
    timestamp: "Select a column",
    eventType: "Payment_received",
    otherAttributes: "Select a column",
  },
  {
    displayName: "Payment Paypal",
    timestamp: "Select a column",
    eventType: "Payment_received",
    otherAttributes: "Select a column",
  },
];

export default function Page() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Workbench Mapping Editor</h1>
      <p className="text-gray-600 mb-6">
        Map columns to event types within the prospective event log.
      </p>
      <DataTable columns={columns} data={sampleData} />
      <div className="flex justify-between mt-6">
        <Button variant="destructive" onClick={() => alert("Going back")}>Back</Button>
        <Button onClick={() => alert("Continuing")}>Continue</Button>
      </div>
    </div>
  );
}
