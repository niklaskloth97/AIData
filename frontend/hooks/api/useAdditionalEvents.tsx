import { useQuery } from "@tanstack/react-query";
import { StringOrTemplateHeader } from "@tanstack/react-table";

export interface AdditionalEvent {
    id: number;
    change_event_name: string;
    change_event_count: string;
    description: string;
    tablesInvolved: string;
    business_object: string;
}

const mockData: AdditionalEvent[] = [
    {
        business_object: "Business Object 1",
        change_event_count: "10",
        change_event_name: "Change Event 1",
        description: "Description of change event 1 here ...",
        id: 1,
        tablesInvolved: "BKPF",
    },
    {
        business_object: "Business Object 1",
        change_event_count: "5",
        change_event_name: "Change Event 2",
        description: "Description of change event 1 here ...",
        id: 2,
        tablesInvolved: "BKPF",
    },
    {
        business_object: "Business Object 2",
        change_event_count: "100",
        change_event_name: "Change Event 4",
        description: "Description of change event 1 here ...",
        id: 3,
        tablesInvolved: "ESG",
    },
    {
        business_object: "Business Object 2",
        change_event_count: "20",
        change_event_name: "Change Event 3",
        description: "Description of change event 1 here ...",
        id: 4,
        tablesInvolved: "ESG",
    },
];

export default function useAdditionalEvents() {
    return useQuery({
        queryKey: ["additionalEvents"],
        queryFn: async () => {
            console.log("Fetching additional events data");
            // const response: TableData[] = await (await fetch("http://localhost:8000/api/table-browser")).json();
            const response = mockData;
            console.log("Fetched additional events data");
            return response;
        },
    });
}
