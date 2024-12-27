// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type MappingData = {
  displayName: string;
  timestamp: string;
  eventType: string;
  otherAttributes: string;
};

export const columns: ColumnDef<MappingData>[] = [
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
          <SelectItem value="column1">Column 1</SelectItem>
          <SelectItem value="column2">Column 2</SelectItem>
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
          <SelectItem value="Address_changed">Address Changed</SelectItem>
          <SelectItem value="Payment_received">Payment Received</SelectItem>
          <SelectItem value="Create/Select">Create / Select</SelectItem>
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
            <SelectItem value="employee_id">Employee ID</SelectItem>
            <SelectItem value="time_taken">Time Taken</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-red-600">
          <Trash2 className="h-5 w-5" /> 
        </Button>
      </div>
    ),
  },
];
