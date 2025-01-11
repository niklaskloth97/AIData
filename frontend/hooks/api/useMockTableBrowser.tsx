import { TableData } from "@/app/dashboard/data-models/editor/columns";
import { useQuery } from "@tanstack/react-query";

export type BrowserTableData = [{
    tableName: string;
    primaryDetected: boolean;
    columnCount: number;
    databaseOrigin: string;
    referenceColumn: string;
    description: string;
  }];
  
export default function useMockTableBrowser() {
    return useQuery({
        queryKey: ["mockTableBrowser"],
        queryFn: async () => {
            console.log("Fetching mock table browser data");
            const response: BrowserTableData = await (await fetch("http://localhost:8000/api/table-browser")).json();
            console.log("Fetched mock table browser data");
            return response;
        },
    });
}