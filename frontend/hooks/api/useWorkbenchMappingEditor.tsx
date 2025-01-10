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
            console.log("Fetching mock mappings");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: MappingEditorData = { mappings: [], options: {columns: ["column1", "column2", "column3", "column4"],
                eventTypes: ["Address_changed", "Payment_received", "Create/Select"],
                attributes: ["employee_id", "time_taken", "cost", "department"]} }
            const mappings = await fetch("http://localhost:8001/api/mappings");    
            
            console.log(mappings)
            
            
            const options = {
                    columns: ["column1", "column2", "column3", "column4"],
                    eventTypes: ["Address_changed", "Payment_received", "Create/Select"],
                    attributes: ["employee_id", "time_taken", "cost", "department"]
                }
            return response;
        },
    });
}