"use client";
import React, { useState } from "react";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";

export function AdapterSelection() {
    const [selectedAdapter, setSelectedAdapter] = useState("");
    const router = useRouter();

    function handleAdapterSubmit() {
        router.push("/setup/initial-chat");
    }

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Adapter Selection Form */}
            <div className="flex items-center justify-center flex-grow">
                <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow w-full max-w-lg">
                    {" "}
                    <PageHeader
                        heading="Select Adapter"
                        subtext="The Adapter will provide the AI with database context and additional knowledge to ensure good results."
                    />
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="adapter">Adapter</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an Adapter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Supported Adapters
                                        </SelectLabel>
                                        <SelectItem value="sap-adapter">
                                            SAP Table Adapter
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAdapterSubmit} className="w-full">
                            Continue with selected Adapter
                        </Button>
                        <Button
                            type="submit"
                            className="w-full"
                            variant="destructive"
                            disabled={true}
                        >
                            Continue without Adapter
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdapterSelection;
