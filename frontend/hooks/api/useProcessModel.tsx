import { useQuery } from "@tanstack/react-query";
import { ProcessModelData } from "@/app/dashboard/process-model/content";

export interface processData {
    processName: string;
    description: string;
    steps: [{
        id: number;
        text: string;
    }]
}

export default function useMockTables() {
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
            const response: processData = await (await fetch("http://localhost:8000/api/process")).json();    
            console.log(response);    
            return response;
        },
    });
}
