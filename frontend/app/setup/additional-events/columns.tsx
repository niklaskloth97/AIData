import * as React from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { MoreHorizontal, Search, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SortableTableHeader from "@/components/sortableTableHeader";
import { useRouter } from "next/navigation";
import ToggleEditCell from "@/components/tableCells/ToggleEditCell";
import { TableData } from "@/hooks/api/useTables";
import { AdditionalEvent } from "@/hooks/api/useAdditionalEvents";

function AIDisplay({
    props,
    targetField,
}: {
    props: CellContext<AdditionalEvent, any>;
    targetField?: string;
}) {
    return (
        <div className="flex items-center">
            {props.getValue()}
            {targetField && props.row.original[targetField] && (
                <span className="ml-2 text-xs text-muted-foreground">
                    (Auto)
                </span>
            )}
        </div>
    );
}

export const columns: ColumnDef<AdditionalEvent>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
        accessorKey: "change_event_name",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Event Name" }),
    },
    {
        accessorKey: "description",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Event Description" }),
    },
    {
        accessorKey: "change_event_count",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Count" }),
    },
    {
        accessorKey: "business_object",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Count" }),
    },
    {
        id: "actions",
        header: "Actions",
        cell: (props) => {
            const data = props.row.original;
            const router = useRouter();

            function setEditedRows() {
                props.table.options.meta?.setEditedRows((old: []) => ({
                    ...old,
                    [props.row.id]: !old[props.row.id],
                }));
                console.log(props.table.options.meta?.editedRows);
            }

            return (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                            router.push(
                                `/dashboard/data-models/editor/column-view?targetTable=${data.id}`
                            )
                        }
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditedRows()}
                    >
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
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        data.change_event_name
                                    )
                                }
                            >
                                Copy event name
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
