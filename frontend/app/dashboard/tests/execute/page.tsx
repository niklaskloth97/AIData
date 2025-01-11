"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Clock, Play, StopCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useMockTestExecution } from "@/hooks/api/useMockTestExecution";
import { useState } from "react";

export default function Page() {
  const { data, isLoading } = useMockTestExecution();
  const [isRunning, setIsRunning] = useState(false);

  const handleStartTest = () => {
    setIsRunning(true);
    // Add test execution logic
  };

  const handleStopTest = () => {
    setIsRunning(false);
    // Add test stop logic
  };

  return (
    <div>
      <PageHeader 
        heading="Test Execution" 
        subtext="Execute and monitor instance tests"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure your test parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Select Test Suite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Test Suite</SelectItem>
                <SelectItem value="extended">Extended Validation</SelectItem>
                <SelectItem value="performance">Performance Tests</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleStopTest}
                disabled={!isRunning}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
              <Button 
                onClick={handleStartTest}
                disabled={isRunning}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Progress</CardTitle>
            <CardDescription>
              Estimated time: {data?.estimatedTime ?? 0} seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={data?.progress ?? 0} />
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Progress: {data?.progress ?? 0}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Current test execution results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Badge variant="default">
                <CheckCircle className="mr-1 h-4 w-4" />
                Passed: {data?.results.passed ?? 0}
              </Badge>
              <Badge variant="destructive">
                <AlertCircle className="mr-1 h-4 w-4" />
                Failed: {data?.results.failed ?? 0}
              </Badge>
              <Badge variant="secondary">
                Skipped: {data?.results.skipped ?? 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Logs Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
            <CardDescription>Real-time execution logs</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {data?.logs.map((log, index) => (
                <div 
                  key={index}
                  className={`mb-2 ${
                    log.includes("[ERROR]") 
                      ? "text-red-500" 
                      : "text-gray-600"
                  }`}
                >
                  {log}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}