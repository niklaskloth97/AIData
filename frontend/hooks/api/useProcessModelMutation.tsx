import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProcessData } from "./useProcessModel";

export default function useProcessModelMutation() {
    return useMutation({
        // queryKey: ["processModel"],

        mutationFn: (processData: ProcessData) => {
            console.log("Updating process model");
            console.log(JSON.stringify(processData));
            return fetch(`http://localhost:8000/api/process/${processData.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(processData),
            });
        },
        onSuccess: async () => {
            const queryClient = useQueryClient()
            queryClient.invalidateQueries({
                queryKey: ["processModel"],
            });
        },
    });
}
