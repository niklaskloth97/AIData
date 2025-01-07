import { useQuery } from "@tanstack/react-query";

// Define the type for the database data
export type DatabaseTableData = {
  databaseName: string;
  url: string;
  linkedInsights: string;
};

// Mock API hook for fetching database table data
export default function useMockDatabases() {
  return useQuery({
    queryKey: ["mockDatabases"],
    queryFn: async () => {
      console.log("Fetching mock databases...");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response: DatabaseTableData[] = [
        {
          databaseName: "SAP",
          url: "jdbc:sapdb://sap.hilti.internal:1234/production",
          linkedInsights: "view extracted tables",
        },
        {
          databaseName: "SAP HANA",
          url: "jdbc:sapdb://hana.hilti.internal:1234/production",
          linkedInsights: "view extracted tables",
        },
        {
          databaseName: "HILTI Internal",
          url: "postgresql://postgres.processes.hilti.com:4321/prod",
          linkedInsights: "view extracted tables",
        },
        {
          databaseName: "More",
          url: "1004",
          linkedInsights: "view extracted tables",
        },
        {
          databaseName: "Databases",
          url: "1005",
          linkedInsights: "view extracted tables",
        },
      ];
      return response;
    },
  });
}
