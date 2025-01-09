import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, ReceiptRussianRuble, Search, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

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
    onDelete: (index: number) => void; // Add this line
}

function EditCell({
    getValue,
    row: { index },
    column: { id },
    table,
}: CellContext<MappingData, any>) {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
    };

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            className="w-full"
        />
    );
}

function TimestampCell(
    options: ColumnOptions,
    props: CellContext<MappingData, any>
) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = (newValue) => {
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            newValue
        );
    };

    return (
        <Select onValueChange={onBlur} value={value}>
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
    );
}

function OtherAttributesCell(
    options: ColumnOptions,
    props: CellContext<MappingData, any>
) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = (newValue) => {
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            newValue
        );
    };

    return (
        <div className="flex flex-wrap gap-2">
            <Select onValueChange={onBlur} value={value}>
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
    );
}

function EventTypeCell(
    options: ColumnOptions,
    props: CellContext<MappingData, any>
) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = (newValue) => {
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            newValue
        );
    };

    return (
        <Select onValueChange={onBlur} value={value}>
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
    );
}

function ActionsCell(
    options: ColumnOptions,
    props: CellContext<MappingData, any>
) {
    return (
        <div className="flex items-center">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log("Inspect", props.row.original)}
            >
                <Search className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => options.onDelete(props.row.index)} // Call with row.index
            >
                <Trash2 className="h-5 w-5" />
            </Button>
        </div>
    );
}

function PrintCell(props: CellContext<MappingData, any>) {
    console.log(props);
}

export const createColumns = (
    options: ColumnOptions
): ColumnDef<MappingData, any>[] => [
    {
        accessorKey: "displayName",
        header: "Display Name",
        cell: EditCell,
    },
    {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: (props) => TimestampCell(options, props),
    },
    {
        accessorKey: "eventType",
        header: "Event Type",
        cell: (props) => EventTypeCell(options, props),
    },
    {
        accessorKey: "otherAttributes",
        header: "Other Attributes",
        cell: (props) => OtherAttributesCell(options, props),
    },
    {
        id: "actions",
        header: "Actions",
        cell: (props) => ActionsCell(options, props),
    },
];
