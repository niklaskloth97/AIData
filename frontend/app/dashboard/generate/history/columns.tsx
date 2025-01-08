import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export type HistoryData = {
  caseId: Record<string, any>;
  scriptProposal: string;
  feedback: string;
};

export const columns: ColumnDef<HistoryData>[] = [
  {
    accessorKey: "caseId",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Case ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {JSON.stringify(row.getValue("caseId"), null, 2)}
      </div>
    ),
  },
  {
    accessorKey: "scriptProposal",
    header: "Script Proposal",
    cell: ({ row }) => {
      const value = row.getValue("scriptProposal") as string;
      return <div>{value.slice(0, 40)}...</div>;
    },
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      
      return (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => router.push(`/dashboard/generate/workbench/script-proposal?id=${row.id}`)}
          >
            <Edit className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log(row.original)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];