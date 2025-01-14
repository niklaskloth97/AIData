import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mapping } from "./useMappings";

export default function useMappingMutation() {
    return useMutation({
        // queryKey: ["processModel"],

        mutationFn: (mappings: Mapping[]) => {
            console.log("Updating mappings");
            console.log(JSON.stringify(mappings));
            return fetch(`http://localhost:8000/api/mappings`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappings),
            });
        },
        onSuccess: async () => {
            const queryClient = useQueryClient()
            queryClient.invalidateQueries({
                queryKey: ["mappings"],
            });
        },
    });
}
