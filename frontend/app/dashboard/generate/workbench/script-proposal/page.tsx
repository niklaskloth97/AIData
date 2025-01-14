"use client";
import React, { useState, useEffect } from "react";
import { useWorkflow } from "../workflowContext";
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
import { set } from "zod";

export default function Page() {
    const { previousStep } = useWorkflow();
    const [sql, setSql] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const { isLoading: isLoadingMappings, data: mappingData } = useMappings();
    const [isLoading, setIsLoading] = useState(true);
    const [currentMappingIndex, setCurrentMappingIndex] = useState(0);
    const [logPreview, setLogPreview] = useState<any[]>([]);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [previousDisabled, setPreviousDisabled] = useState(true);

    useEffect(() => {
        setMappings(mappingData ?? []);
    }, [mappingData]);

    // Load all stored data on mount
    useEffect(() => {
        const storedSql = sessionStorage.getItem("scriptProposalSQL");
        const storedFeedback = sessionStorage.getItem("scriptProposalFeedback");

        // If we have stored data, use it; otherwise use initial data from API
        if (storedSql) {
            const parsedSql = JSON.parse(storedSql);
            setSql(parsedSql);
        }

        if (storedFeedback) {
            const parsedFeedback = JSON.parse(storedFeedback);
            setFeedback(parsedFeedback);
        }

        setIsLoading(false);
    }, []);

    // Handle navigation back
    const handleBack = () => {
        // Store all state before navigation
        sessionStorage.setItem("scriptProposalSQL", sql.toString());
        sessionStorage.setItem("scriptProposalFeedback", feedback.toString());
        previousStep();
    };

    // Update textarea for feedback
    const handleFeedbackChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFeedback((f) => {
            f[currentMappingIndex] = e.target.value;
            return f;
        });
    };

    async function regenerate() {
        const generation = await useScriptProposal({
            mappingId: mappings[currentMappingIndex].id,
            userInput: feedback[currentMappingIndex] ?? "",
            script: sql[currentMappingIndex] ?? "",
        });
        setSql((sql) => {
            sql[currentMappingIndex] = generation.sqlScript ?? "";
            return sql;
        });
    }

    function getLogPreview() {}

    function nextMapping() {
        setCurrentMappingIndex((index) => {
            if (index < mappings.length - 1) {
                setPreviousDisabled(false);
                if (index + 1 === mappings.length - 1) {
                    setNextDisabled(true);
                }
                return index + 1;
            }
            return index;
        });
    }

    function previousMapping() {
        setCurrentMappingIndex((index) => {
            if (index > 0) {
                if (index - 1 === 0) {
                    setPreviousDisabled(true);
                }
                setNextDisabled(false);
                return index - 1;
            }
            setPreviousDisabled(true);
            return index;
        });
    }

    if (isLoadingMappings) {
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
                        heading={`SQL Script Proposal for ${
                            mappings[currentMappingIndex]?.displayName ??
                            "Loading…"
                        }`}
                        subtext="Adjust the SQL script to your needs. Give feedback on the right."
                    />
                    <div className="flex justify-between items-center mb-2">
                        <Button
                            variant={"outline"}
                            disabled={previousDisabled}
                            onClick={previousMapping}
                        >
                            {" "}
                            Previous{" "}
                        </Button>
                        <div className="text-gray-600 text-center">
                            {" "}
                            {`Nr. ${currentMappingIndex + 1} of ${
                                mappings.length
                            }`}{" "}
                        </div>
                        <Button
                            variant={"outline"}
                            disabled={nextDisabled}
                            onClick={nextMapping}
                        >
                            {" "}
                            Next{" "}
                        </Button>
                    </div>
                    <Controlled
                        value={sql[currentMappingIndex]}
                        extensions={[basicSetup, sqlLang() as any]} // Enable SQL syntax highlighting
                        theme={githubLight}
                        onChange={(value) =>
                            setSql((sql) => {
                                sql[currentMappingIndex] = value;
                                return sql;
                            })
                        }
                        className="border border-gray-200 rounded p-2"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                        Your changes will be passed to the AI-Engine as part of
                        the feedback
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 justify-start">
                        <Button variant="secondary" onClick={handleBack}>
                            Edit Mappings
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => alert("NOT IMPLEMENTED :(")}
                        >
                            Discard Changes
                        </Button>
                        <Button onClick={() => regenerate()}>
                            Re-Generate
                        </Button>
                        <Button
                            onClick={() =>
                                alert("Imagine you are download the script :)")
                            }
                        >
                            Export
                        </Button>
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
                                value={feedback[currentMappingIndex]}
                                onChange={handleFeedbackChange}
                            />
                        </div>
                    </div>

                    {/* 3rd card: "Event Log Preview" */}
                    <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
                        <PageHeader
                            heading="Event Log Preview"
                            subtext="Anything missing? Add feedback, edit script, or re-generate."
                        />
                        <DataTable columns={columns} data={[]} />
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
