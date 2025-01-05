import { useQuery } from "@tanstack/react-query";
import { ProcessModelData } from "@/app/dashboard/process-model/content";

export default function useMockTables() {
    return useQuery({
        queryKey: ["processModel"],
        queryFn: async () => {
            console.log("Fetching mock process model");
            //Wait to simulate network request
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: ProcessModelData = {
                processName: "Process Model",
                description: "This is a description",
                steps: [
                    { id: 1, text: "Step 1: Define your step here" },
                    { id: 2, text: "Step 2: Add another step" },
                  ]
            }
            return response;
        },
    });
}
