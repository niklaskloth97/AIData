import { Button } from "@/components/ui/button";

interface TableFloatingWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TableFloatingWindow = ({ isOpen, onClose }: TableFloatingWindowProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-96">
                <h2 className="text-xl font-bold mb-4">Additional Information</h2>
                <p>Details about the selected item can go here.</p>
                <Button variant="default" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
};