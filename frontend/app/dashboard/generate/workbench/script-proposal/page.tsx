"use client";
import React, { useState, useEffect } from "react";
import { useWorkflow } from '../workflowContext';
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
import useMappings, { Mapping } from "@/hooks/api/useMappings";
import useScriptProposal from "@/hooks/api/useScriptProposal";

export default function Page() {
  const { previousStep } = useWorkflow();
  const { isLoading, data: mockData } = useScriptProposal();
  const [sql, setSql] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const { isLoading: isLoadingMappings, data: mappingData } = useMappings();

  useEffect(() => {
    setMappings(mappingData ?? []);
  }, [mappingData]);

  // Load all stored data on mount
  useEffect(() => {
    const storedSql = sessionStorage.getItem('scriptProposalSQL');
    const storedFeedback = sessionStorage.getItem('scriptProposalFeedback');
    
    // If we have stored data, use it; otherwise use initial data from API
    if (storedSql) {
      setSql(storedSql);
    } else if (mockData?.initialSQL) {
      setSql(mockData.initialSQL);
    }
    
    if (storedFeedback) {
      setFeedback(storedFeedback);
    }
  }, [mockData]);

  // Handle navigation back
  const handleBack = () => {
    // Store all state before navigation
    sessionStorage.setItem('scriptProposalSQL', sql);
    sessionStorage.setItem('scriptProposalFeedback', feedback);
    previousStep();
  };

  // Update textarea for feedback
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="rounded-md grid grid-cols-2 gap-4">
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
            <Button variant="secondary" onClick={handleBack}>Edit Mappings</Button>
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
              <Label htmlFor="feedback">Your message</Label>
              <Textarea 
                placeholder="Type your feedback to the AI here." 
                id="feedback"
                value={feedback}
                onChange={handleFeedbackChange}
              />
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

      <div className="mt-6 flex justify-start">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
}