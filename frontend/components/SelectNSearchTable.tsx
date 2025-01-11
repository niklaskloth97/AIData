import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectNSearchTableProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectButton: string;
}

export function SelectNSearchTable({
  globalFilter,
  setGlobalFilter,
  selectButton,
}: SelectNSearchTableProps) {
  return (
    <div className="flex items-center mb-4 space-x-4">
      <div className="flex items-center space-x-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={selectButton} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tableName">Table Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder="Search..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}