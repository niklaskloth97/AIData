import { useQuery } from "@tanstack/react-query";

export interface TestExecutionData {
  estimatedTime: number; // in seconds
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  configuration: {
    instanceId: string;
    numberOfRows: number;
    testCases: number;
  };
  results: {
    passed: number;
    failed: number;
    skipped: number;
  };
  logs: string[];
}

export function useMockTestExecution() {
  return useQuery({
    queryKey: ["testExecution"],
    queryFn: async (): Promise<TestExecutionData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        estimatedTime: 180,
        progress: 45,
        status: 'running',
        configuration: {
          instanceId: "inst_123",
          numberOfRows: 1000,
          testCases: 5
        },
        results: {
          passed: 3,
          failed: 1,
          skipped: 1
        },
        logs: [
          "[INFO] Initializing test environment...",
          "[INFO] Loading test data...",
          "[ERROR] Failed to validate case #4",
          "[INFO] Cleaning up test resources..."
        ]
      };
    },
  });
}