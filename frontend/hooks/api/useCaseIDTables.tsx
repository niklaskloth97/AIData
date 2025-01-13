import { TableData } from "@/app/dashboard/generate/workbench/case-id-builder/columns";
import { useQuery } from "@tanstack/react-query";

export default function useCaseIDTables() {
    return useQuery({
        queryKey: ["CaseIDTables"],
        queryFn: async () => {
            console.log("Fetching Case ID tables");
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: TableData = await (await fetch("http://localhost:8000/api/case-ids/")).json();    
                        console.log("The Respone", response);    
                        return response;
            // queryFn: async () => {
            //             console.log("Fetching mappings");
            //             const response: MappingEditorData = await (await fetch("http://localhost:8000/api/mappings")).json();    
            //             console.log(response);    
            //             return response;
            //         },
            // const response: TableData[] = [
            //     {
            //         tableName: "BKPF",
            //         referenceColumn: "ORDERID",
            //         description: "Helps identify the type of action performed during the change event",
            //     },
            //     {
            //         tableName: "EBKE",
            //         referenceColumn: "RefORDERID",
            //         description: "Helps identify the type of action performed during the change event",
            //     }
            // ];
            // return response;
        },
    });
}