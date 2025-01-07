import { useQuery } from "@tanstack/react-query";

export default function useSidebarChat() {
    return useQuery({
        queryKey: ["sidebarChat"],
        queryFn: async () => {
            console.log("Fetching mock tables");
            //Wait to simulate network request
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return {}
        }
    });
}