import * as React from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Search, Edit, Check, Sparkles } from "lucide-react";
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
import { ColumnData } from "@/hooks/api/useTableColumn";
import ToggleEditCell from "@/components/tableCells/ToggleEditCell";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function NameDisplay({
    props,
    targetField,
}: {
    props: CellContext<ColumnData, any>;
    targetField?: string;
}) {
    return (
        <div className="flex items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="flex items-center">
                            {props.getValue()}
                            {targetField && props.row.original[targetField] && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    <Sparkles className="w-4 h-4"/>
                                </span>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {props.row.original.nativeColumnName}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

function AIDisplay({
    props,
    targetField,
}: {
    props: CellContext<ColumnData, any>;
    targetField?: string;
}) {
    return (
        <div className="flex items-center">
            {props.getValue()}
            {targetField && props.row.original[targetField] && (
                <span className="ml-2 text-xs text-muted-foreground">
                    <Sparkles className="w-4 h-4"/>
                </span>
            )}
        </div>
    );
}

function PrimaryKeyCell({ isPrimaryKey }) {
    if (isPrimaryKey) {
        return (
            <div className="flex w-full">
                <Check className="w-5 h-5" />
            </div>
        );
    }
    return <div></div>;
}

export const columns: ColumnDef<ColumnData, any>[] = [
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
        accessorKey: "column_name",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Column Name" }),
        cell: (props) =>
            ToggleEditCell({
                props,
                DisplayComponent: (p) =>
                    NameDisplay({
                        props: p,
                        targetField: "column_nameAutoGenerated",
                    }),
                aIToggleTarget: "column_nameAutoGenerated",
            }),
    },
    {
        accessorKey: "isPrimaryKey",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Primary Key?" }),
        cell: (props) => <PrimaryKeyCell isPrimaryKey={props.getValue()} />,
    },
    {
        accessorKey: "dataType",
        header: ({ column }) =>
            SortableTableHeader({ column, text: "Data Type" }),
        cell: (props) => <div>{props.getValue()}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: (props) =>
            ToggleEditCell({
                props,
                DisplayComponent: (p) =>
                    AIDisplay({
                        props: p,
                        targetField: "descriptionsAutoGenerated",
                    }),
                aIToggleTarget: "descriptionsAutoGenerated",
            }),
    },
    {
        id: "actions",
        header: "Actions",
        cell: (props) => {
            const data = props.row.original;

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
                            alert(`Search action for ${data.nativeColumnName}`)
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
                                        data.nativeColumnName
                                    )
                                }
                            >
                                Copy column name
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
