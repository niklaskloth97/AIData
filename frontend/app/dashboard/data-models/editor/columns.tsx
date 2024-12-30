import * as React from "react";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Search, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type TableData = {
    tableName: string;
    referenceColumn: string;
    description: string;
  };

export const columns: ColumnDef<TableData>[] = [
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
    accessorKey: "tableName",
    header: "Table Naaaaame",
  },
  {
    accessorKey: "referenceColumn",
    header: ({ column }) => (
      <div className="flex items-center gap-2"
        // variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reference Column
        <ArrowUpDown className="py-0.5"/>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  }
];
