"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowData,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import React from "react";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (
            rowIndex: number,
            columnId: string,
            value: unknown
        ) => void;
    }
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    globalFilter?: string;
    onSelectionChange?: (rows: TData[]) => void;
    autoResetPageIndex?: boolean;
    skipAutoResetPageIndex?: () => void;
}

export function useSkipper() {
    const shouldSkipRef = React.useRef(true);
    const shouldSkip = shouldSkipRef.current;

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false;
    }, []);

    React.useEffect(() => {
        shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
}

// const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

export function DataTable<TData>({
    columns,
    data,
    setData,
    globalFilter,
    onSelectionChange,
    autoResetPageIndex,
    skipAutoResetPageIndex,
}: DataTableProps<TData>) {
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        state: {
            sorting,
            globalFilter,
            rowSelection,
        },
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex?.();
                if (setData)
                    setData((old) =>
                        old.map((row, index) => {
                            if (index === rowIndex) {
                                return {
                                    ...old[rowIndex]!,
                                    [columnId]: value,
                                };
                            }
                            return row;
                        })
                    );
            },
        },
    });

    // Note to myself...Moved effect outside table configuration, so that I can use it idependently
    useEffect(() => {
        if (onSelectionChange) {
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original);
            onSelectionChange(selectedRows);
        }
    }, [rowSelection]); // Only depend on rowSelection for state save

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
