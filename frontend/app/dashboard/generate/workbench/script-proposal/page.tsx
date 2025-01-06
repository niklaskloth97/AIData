"use client";
import React, { useState } from "react";
import Controlled from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { sql as sqlLang } from "@codemirror/lang-sql";
import { githubLight } from "@uiw/codemirror-theme-github";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import { Loader } from "lucide-react";
import useMockScriptProposal from "@/hooks/api/useMockScriptProposal";

export default function Page() {
  const { isLoading, data: mockData } = useMockScriptProposal();
  const [sql, setSql] = useState(mockData?.initialSQL || ""); // Add null check and default value
  const [feedback, setFeedback] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-md grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
         <PageHeader
                        heading="SQL Script Proposal"
                        subtext="Adjust the SQL script to your needs."
                    />
        <Controlled
          value={sql}
          extensions={[basicSetup, sqlLang() as any]}  // Enable SQL syntax highlighting
          theme={githubLight}
          onChange={(value) => setSql(value)}
          className="border border-gray-200 rounded p-2"
        />
        <div className="mt-2 text-sm text-gray-600">Your changes will be passed to the AI-Engine as part of the feedback</div>
        <div className="flex flex-wrap gap-4 mt-4 justify-start">
          <Button variant="secondary" onClick={() => alert("Mappings Edited")}>Edit Mappings</Button>
          <Button variant="destructive" onClick={() => alert("Changes Discarded")}>Discard Changes</Button>
          <Button onClick={() => alert("Script Regenerated")}>Re-Generate</Button>
          <Button onClick={() => alert("Script Exported")}>Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-subgrid gap-4">
        {/* 2nd card: "Add Feedback" */}
        <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
          <PageHeader
                heading="Add Feedback"
                subtext="Your feedback will be attached to the SQL script."
            />
          <div className="">
            <Label htmlFor="message">Your message</Label>
            <Textarea placeholder="Type your feedback to the AI here." id="feedback" />
          </div>
        </div>
      
      {/* 3rd card: "Event Log Preview" */}
        <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
        <PageHeader
          heading="Event Log Preview"
          subtext="Anything missing? Add feedback or adapt the script"
            />
          <DataTable columns={columns} data={mockData?.sampleData || []} />
        </div>
      </div>
    </div>
  );
}
