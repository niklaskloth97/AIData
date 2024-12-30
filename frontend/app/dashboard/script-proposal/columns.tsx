import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type TableData = {
  caseId: number;
  activity: string;
  timestamp: string;
  otherAttributes: string;
};

export const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "caseId",
    header: "Case ID",
    cell: ({ row }) => row.original.caseId,
  },
  {
    accessorKey: "activity",
    header: "Activity",
    cell: ({ row }) => row.original.activity,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => row.original.timestamp,
  },
  {
    accessorKey: "otherAttributes",
    header: "Other Attributes",
    cell: ({ row }) => row.original.otherAttributes,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">🔍</Button>
      </div>
    ),
  },
];
