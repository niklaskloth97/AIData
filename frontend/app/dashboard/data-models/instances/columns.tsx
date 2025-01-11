import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type InstanceData = {
  id: string;
  createdAt: string;
  tableNames: Record<string, string[]>;
  dataSources: Record<string, string>;
  rowCount: number;
  status: "active" | "inactive";
  description: string;
};

interface DeleteConfirmProps {
  onDelete: (id: string) => void;
  id: string;
}

interface ColumnOptions {
  onDelete: (id: string) => void;
}

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm }: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Instance</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this instance? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const columns = (options: ColumnOptions): ColumnDef<InstanceData>[] => [
  {
    accessorKey: "id",
    header: "Instance ID",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "tableNames",
    header: "Tables",
    cell: ({ row }) => (
      <div className="font-mono text-sm max-w-[200px] truncate">
        {JSON.stringify(row.getValue("tableNames"))}
      </div>
    ),
  },
  {
    accessorKey: "dataSources",
    header: "Sources",
    cell: ({ row }) => (
      <div className="font-mono text-sm max-w-[200px] truncate">
        {JSON.stringify(row.getValue("dataSources"))}
      </div>
    ),
  },
  {
    accessorKey: "rowCount",
    header: "Rows",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("status") === "active" ? "text-green-600" : "text-red-600"}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const data = row.original;

      const handleDelete = () => {
        options.onDelete(data.id);
        setIsDeleteOpen(false);
      };

      return (
        <>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => router.push(`/dashboard/generate/workbench?instanceId=${data.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="text-red-600"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <DeleteConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      );
    },
  },
];