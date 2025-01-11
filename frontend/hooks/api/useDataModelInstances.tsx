import { InstanceData } from "@/app/dashboard/data-models/instances/columns";
import { useQuery } from "@tanstack/react-query";

export default function useDataModelInstances() {
    return useQuery({
        queryKey: ["dataModelInstances"],
        queryFn: async () => {
            console.log("Fetching instances");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: InstanceData[] = [
                {
                    id: "inst_001",
                    createdAt: "2024-03-15T10:00:00Z",
                    tableNames: {
                        "SAP": ["BKPF", "BSEG"],
                        "Oracle": ["Orders", "Items"]
                    },
                    dataSources: {
                        "BKPF": "SAP",
                        "Orders": "Oracle"
                    },
                    rowCount: 1500,
                    status: "active",
                    description: "Test instance for order processing",
                },
                {
                    id: "inst_002",
                    createdAt: "2024-03-14T15:30:00Z",
                    tableNames: {
                        "PostgreSQL": ["users", "events"]
                    },
                    dataSources: {
                        "users": "PostgreSQL",
                        "events": "PostgreSQL"
                    },
                    rowCount: 750,
                    status: "inactive",
                    description: "User activity analysis instance",
                }
            ];
            return response;
        },
    });
}