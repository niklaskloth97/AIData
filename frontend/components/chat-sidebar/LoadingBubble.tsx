import { Loader } from "lucide-react";

export default function LoadingBubble(){
    return(
        <div className="bg-gray-200 p-2 rounded-lg mr-2">
            <Loader className="animate-spin" />
        </div>
    )
}