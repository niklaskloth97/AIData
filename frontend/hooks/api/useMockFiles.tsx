import { useQuery } from "@tanstack/react-query";

// Define the type for the file data
export type FileTableData = {
  fileName: string;
  fileType: string;
  fileSize: string;
  lastModified: string;
  uploadedBy: string;
};

// Mock API hook for fetching file table data
export default function useMockFiles() {
  return useQuery({
    queryKey: ["mockFiles"],
    queryFn: async () => {
      console.log("Fetching mock files...");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response: FileTableData[] = [
        {
          fileName: "BKPF",
          fileType: "CSV",
          fileSize: "2.4 MB",
          lastModified: "2025-01-05 14:32",
          uploadedBy: "John Doe",
        },
        {
          fileName: "BSEG",
          fileType: "TXT",
          fileSize: "1.2 MB",
          lastModified: "2025-01-04 10:18",
          uploadedBy: "Jane Smith",
        },
        {
          fileName: "CDHDR",
          fileType: "PDF",
          fileSize: "3.8 MB",
          lastModified: "2025-01-06 08:45",
          uploadedBy: "Alice Johnson",
        },
      ];
      return response;
    },
  });
}
