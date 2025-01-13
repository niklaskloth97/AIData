import * as React from "react";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaseIdData } from "@/hooks/api/useCaseIDTables";

export const columns: ColumnDef<CaseIdData, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectTables_nativeTableName",
    header: "Table Name",
  },
  {
    accessorKey: "referenceColumns",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reference Collumns
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (props) => { return(<div className="break-words"> {props.getValue().map((i)=> {return ` ${i}`})} </div>) }
  },
  {
    accessorKey: "projectTables_description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => alert(`Search action for ${data.projectTables_nativeTableName}`)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => alert(`Edit action for ${data.projectTables_nativeTableName}`)}>
            <Edit className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(data.projectTables_nativeTableName)}
              >
                Copy table name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
