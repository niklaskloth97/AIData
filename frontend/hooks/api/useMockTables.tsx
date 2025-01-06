import { TableData } from "@/app/dashboard/data-models/editor/columns";
import { useQuery } from "@tanstack/react-query";

export default function useMockTables() {
    return useQuery({
        queryKey: ["mockTables"],
        queryFn: async () => {
            console.log("Fetching mock tables");
            //Wait to simulate network request
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: TableData[] = [
                {
                  tableName: "BKPF",
                  primaryDetected: true,
                  columnCount: 15,
                  databaseOrigin: "SAP",
                  referenceColumn: "ORDERID",
                  description: "Helps identify the type",
                },
                {
                  tableName: "BKPF",
                  primaryDetected: false,
                  columnCount: 8,
                  databaseOrigin: "SAP",
                  referenceColumn: "RDERID",
                  description: "Helps identify the type",
                },
              ];
            return response;
        },
    });
}
