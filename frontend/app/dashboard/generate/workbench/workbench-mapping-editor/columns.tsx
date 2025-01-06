import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type MappingData = {
  displayName: string;
  timestamp: string;
  eventType: string;
  otherAttributes: string;
};

interface ColumnOptions {
  columns: string[];
  eventTypes: string[];
  attributes: string[];
  onDelete: (index: number) => void;  // Add this line
}

export const createColumns = (options: ColumnOptions): ColumnDef<MappingData>[] => [
  {
    accessorKey: "displayName",
    header: "Display Name",
    cell: ({ row }) => (
      <Input defaultValue={row.original.displayName} className="w-full" />
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a column" />
        </SelectTrigger>
        <SelectContent>
          {options.columns.map((column) => (
            <SelectItem key={column} value={column}>
              {column}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
    cell: ({ row }) => (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent>
          {options.eventTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "otherAttributes",
    header: "Other Attributes",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent>
            {options.attributes.map((attr) => (
              <SelectItem key={attr} value={attr}>
                {attr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => console.log("Inspect", row.original)}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600"
          onClick={() => options.onDelete(row.index)}  // Call with row.index
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    ),
  }
];