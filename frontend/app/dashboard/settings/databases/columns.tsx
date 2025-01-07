import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Search } from "lucide-react";
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

export type DatabaseTableData = {
  databaseName: string;
  url: string;
  linkedInsights: string;
};

export const createDatabaseColumns: ColumnDef<DatabaseTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "databaseName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Database Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => <div>{row.getValue("url")}</div>,
  },
  {
    accessorKey: "linkedInsights",
    header: "Linked Insights",
    cell: ({ row }) => <div>{row.getValue("linkedInsights")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => alert(`Search action for ${data.databaseName}`)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => alert(`Edit action for ${data.databaseName}`)}>
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
                onClick={() => navigator.clipboard.writeText(data.databaseName)}
              >
                Copy database name
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
