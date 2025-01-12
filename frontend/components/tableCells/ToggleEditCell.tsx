import { CellContext } from "@tanstack/react-table";
import { JSX, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ToggleEditCell<T>({
    props,
    DisplayComponent,
    aIToggleTarget,
}: {
    props: CellContext<T, any>;
    DisplayComponent: (props: CellContext<T, any>) => JSX.Element;
    aIToggleTarget?: string;
}) {
    const initialValue = props.getValue();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        props.table.options.meta?.updateData(
            props.row.index,
            props.column.id,
            value
        );
        if (aIToggleTarget)
            props.table.options.meta?.toggleAIGenerated(aIToggleTarget, props.row.index);
    };

    if (props.table.options.meta?.editedRows[props.row.id]) {
        return (
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                className=""
            />
        );
    }
    return DisplayComponent(props);
}
