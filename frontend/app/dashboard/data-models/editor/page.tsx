"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import PageHeader from "@/components/PageHeader";
import useMockTables, { TableData } from "@/hooks/api/useTables";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFloatingWindow } from "@/components/TableFloatingWindow";
import { SelectNSearchTable } from "@/components/SelectNSearchTable";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { routeros } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CreateInstanceDialog = ({ isOpen, onClose, onConfirm }: { 
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Instance</DialogTitle>
          <DialogDescription>
            Create a new Instance of your current data model to be used for script generation and tests.
          </DialogDescription>
        </DialogHeader>
        <div>
            Further Input Content
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Create Instance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

export default function Page() {
    const { isLoading, data } = useMockTables();
    const [tableData, setTableData] = useState<TableData[]>([]);

    const [floatingWindowOpen, setFloatingWindowOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Load initial data
    useEffect(() => {
        setTableData(data ?? []);
    }, [data]);

    function handleCreateInstance() {
        setFloatingWindowOpen(false)
        console.log("confirm")
        
    }

    return (
        <>
            <PageHeader
                heading="Data Model Editor"
                subtext="View which data are used in the system."
            />
            {/* <SelectNSearchTable 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectButton="Select Table"
            /> */}

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="">
                    <Input
                        placeholder="Search..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="m-4"></div>
                    <DataTable
                        data={tableData ?? []}
                        columns={columns}
                        globalFilter={globalFilter}
                        setData={setTableData}
                    />
                </div>
            )}

            <div className="mt-6 flex w-full justify-end">
                <Button
                    className=""
                    variant="default"
                    disabled={false}
                    onClick={() => setFloatingWindowOpen(true)}
                >
                    Create Instance
                </Button>
            </div>

            <CreateInstanceDialog
                isOpen={floatingWindowOpen}
                onClose={() => setFloatingWindowOpen(false)}
                onConfirm={() => handleCreateInstance()}
            >
            </CreateInstanceDialog>
        </>
    );
}
