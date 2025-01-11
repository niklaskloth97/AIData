"use client";
import React, { useState } from 'react';
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from '@/components/PageHeader';

export function CreateModelInstance() {
  const [displayName, setDisplayName] = useState("");
  const [rowAmount, setRowAmount] = useState("100");

  const handleCreateInstance = () => {
    console.log(`Model Instance Created:\nName: ${displayName}\nRow Amount: ${rowAmount}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow w-full max-w-lg">
        <PageHeader
          heading="Create Model Instance"
          subtext="Adjust the parameters and create a model instance."
        />
        <div className="grid gap-6 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Model Instance Display Name</Label>
            <Input
              id="displayName"
              placeholder="Instance Displayname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rowAmount">Desired Row Amount (to be available for testing)</Label>
            <Input
              id="rowAmount"
              type="number"
              placeholder="100"
              value={rowAmount}
              onChange={(e) => setRowAmount(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            onClick={handleCreateInstance}
          >
            Create Instance
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateModelInstance;
