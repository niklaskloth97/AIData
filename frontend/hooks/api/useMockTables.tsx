import { TableData } from "@/app/dashboard/data-models/editor/columns";
import { useQuery } from "@tanstack/react-query";

export default function useMockTables() {
    return useQuery({
        queryKey: ["mockTables"],
        queryFn: async () => {
                console.log("Fetching mock table browser data");
                const response: TableData = await (await fetch("http://localhost:8000/api/table-browser")).json();
                console.log("Fetched mock table browser data");
                return response;
        },
    });
}
