import { HistoryData } from "@/app/dashboard/generate/history/columns";
import { useQuery } from "@tanstack/react-query";

export default function useWorkbenchHistory() {
    return useQuery({
        queryKey: ["workbenchHistory"],
        queryFn: async () => {
            console.log("Fetching history data");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: HistoryData[] = [
                {
                    caseId: { 
                        table: "BKPF",
                        column: "ORDERID",
                        table2: "VBAK",
                        column2: "VBELN"
                    },
                    scriptProposal: "SELECT * FROM BKPF WHERE ORDERID IN (SELECT DISTINCT ORDERID FROM...",
                    feedback: "This looks good, but we need to add more joins",
                },
                {
                    caseId: { 
                        table: "VBAK",
                        column: "VBELN" 
                    },
                    scriptProposal: "SELECT VBELN, ERDAT, ERZET FROM VBAK WHERE VBELN IN...",
                    feedback: "Perfect match for our use case",
                }
            ];
            return response;
        },
    });
}