import { TableData } from "@/app/dashboard/generate/workbench/case-id-builder/columns";
import { useQuery } from "@tanstack/react-query";

export default function useMockCaseIDTables() {
    return useQuery({
        queryKey: ["mockCaseIDTables"],
        queryFn: async () => {
            console.log("Fetching mock Case ID tables");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: TableData[] = [
                {
                    tableName: "BKPF",
                    referenceColumn: "ORDERID",
                    description: "Helps identify the type of action performed during the change event",
                },
                {
                    tableName: "EBKE",
                    referenceColumn: "RefORDERID",
                    description: "Helps identify the type of action performed during the change event",
                }
            ];
            return response;
        },
    });
}