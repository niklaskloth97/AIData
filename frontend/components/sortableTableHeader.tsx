import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export default function SortableTableHeader({ column, text }) {
    return (
            <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <div>{text}</div>
                
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        
    );
}
