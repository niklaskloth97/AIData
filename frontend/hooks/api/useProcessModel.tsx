import { useQuery } from "@tanstack/react-query";

export interface Step {
    id: number;
    name: string;
    description: string;
    projectProcess_id: number;
    tablesInvolved: string;
    nativeColumnName: string;
}
export interface ProcessData {
    id: number;
    name: string;
    description: string;
    steps: Step[]
    project_id: number
}

export default function useProcessModel() {
    return useQuery({
        queryKey: ["processModel"],
        queryFn: async () => {
            console.log("Fetching process model");
            //Wait to simulate network request
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            // const response: ProcessModelData = {
            //     processName: "Process Model",
            //     description: "This is a description",
            //     steps: [
            //         { id: 1, text: "Step 1: Define your step here" },
            //         { id: 2, text: "Step 2: Add another step" },
            //       ]
            // }
            console.log("Fetching process");
            const response: ProcessData = await (await fetch("http://localhost:8000/api/process")).json();    
            console.log(response);    
            return response;
        },
    });
}
