import { MappingData } from "@/app/dashboard/generate/workbench/workbench-mapping-editor/columns";
import { useQuery } from "@tanstack/react-query";

export interface MappingEditorData {
  mappings: MappingData[];
  options: {
    columns: string[];
    eventTypes: string[];
    attributes: string[];
  }
}

export default function useMockWorkbenchMappingEditor() {
    return useQuery({
        queryKey: ["mockMappings"],
        queryFn: async () => {
            console.log("Fetching mappings");
            const response: MappingEditorData = await (await fetch("http://localhost:8000/api/mappings")).json();    
            console.log(response);    
            return response;
        },
    });
}