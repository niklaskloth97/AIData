import { useQuery } from "@tanstack/react-query";

export type PossibleMapping = {
    id: number;
    displayName: string;
    timestampColumn: string;
    eventType: string;
    possibleAttributes: [];
    involvedTable: string;
    otherAttributes?: [];
}

export default function useAdditionalEvents() {
    return useQuery({
        queryKey: ["possibleMappings"],
        queryFn: async () => {
            console.log("Fetching possible mappings data");
            const response: PossibleMapping[] = await (await fetch("http://localhost:8000/api/possible-mappings")).json();
            //const response = mockData;
            console.log(response)
            console.log("Fetched possible mappings data");
            return response;
        },
    });
}