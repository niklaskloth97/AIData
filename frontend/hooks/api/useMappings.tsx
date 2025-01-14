import { useQuery } from "@tanstack/react-query";

export type Mapping = {
    id: number;
    displayName: string;
    timestampColumn: string;
    eventType: string;
    otherAttributes: [];
    tableInvolved: string;
};

export default function useMappings() {
    return useQuery({
        queryKey: ["mappings"],
        queryFn: async () => {
            console.log("Fetching mappings");
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: Mapping[] = await (
                await fetch("http://localhost:8000/api/mappings")
            ).json();
            console.log("The Respone", response);
            return response;
        },
    });
}
