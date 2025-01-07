import { TableData } from "@/app/dashboard/data-models/editor/columns";
import { useQuery } from "@tanstack/react-query";

export interface TableBrowserData {
  tables: TableData[];
  sources: string[];
}

export default function useMockTableBrowser() {
    return useQuery({
        queryKey: ["mockTableBrowser"],
        queryFn: async () => {
            console.log("Fetching mock table browser data");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: TableBrowserData = {
                tables: [
                    {
                        tableName: "BKPF",
                        primaryDetected: true,
                        columnCount: 15,
                        databaseOrigin: "SAP",
                        referenceColumn: "ORDERID",
                        description: "Helps identify the type",
                    },
                    {
                        tableName: "EBKE",
                        primaryDetected: false,
                        columnCount: 8,
                        databaseOrigin: "Oracle",
                        referenceColumn: "RDERID",
                        description: "Helps identify the type",
                    }
                ],
                sources: ["SAP", "Oracle", "PostgreSQL"]
            };
            return response;
        },
    });
}