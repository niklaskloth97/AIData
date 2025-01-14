import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {Search} from "lucide-react";


export type TableData = {
  CASEID: string;
  EVENTNAME: string;
  TIMESTAMP: string;
  otherAttributes: {};
};

export const columns: ColumnDef<TableData, any>[] = [
  {
    accessorKey: "CASEID",
    header: "Case ID",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "EVENTNAME",
    header: "Event Name",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "TIMESTAMP",
    header: "Timestamp",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "otherAttributes",
    header: "Other Attributes",
    cell: (props) => {
      <div> {props.getValue()} </div>
    },
  }

  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => alert(`Search action for Event log preview`)}>
  //                   <Search className="h-5 w-5" />
  //                 </Button>
  //     </div>
  //   ),
  // },
];
