import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { PossibleMapping } from "@/hooks/api/usePossibleMappings";

interface ColumnOptions {
    timestampColumns: string[];
    eventTypes: string[];
    otherAttributes: string[];
    onDelete: (index: number) => void; // Add this line
}

function EditCell({
    getValue,
    row: { index },
    column: { id },
    table,
}: CellContext<PossibleMapping, any>) {
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
    props: CellContext<PossibleMapping, any>
) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = (newValues) => {
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            newValues
        );
    };

    return (
        <Select onValueChange={onBlur} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
                {options.timestampColumns.map((column) => (
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
    props: CellContext<PossibleMapping, any>
) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

        // Hier die Funktion ergänzen, damit die mit dem multiselect funkt.
    const onBlur = (newValues) => {
        console.log(newValues)
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            newValues
        );
    };

    const attributeOptions = options.otherAttributes.map(attr => ({
        label: attr,
        value: attr
    }));

    return (
        <MultiSelect
            options={attributeOptions}
            onValueChange={onBlur}
            defaultValue={value} // Fix: use values instead of initialValues
            placeholder="Select attributes"
            className="min-w-[200px]"
            animation={0}
            maxCount={5}
        />
    );
}

function EventTypeCell(
    options: ColumnOptions,
    props: CellContext<PossibleMapping, any>
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
    props: CellContext<PossibleMapping, any>
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

function PrintCell(props: CellContext<PossibleMapping, any>) {
    console.log(props);
}

export const createColumns = (
    options: ColumnOptions
): ColumnDef<PossibleMapping, any>[] => [
    {
        accessorKey: "displayName",
        header: "Display Name",
        cell: EditCell,
    },
    {
        accessorKey: "timestampColumn",
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
