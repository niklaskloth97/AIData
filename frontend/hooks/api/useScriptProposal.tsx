import { useQuery } from "@tanstack/react-query";
import { StringOrTemplateHeader } from "@tanstack/react-table";

export interface ScriptProposal {
    sqlScript: string;
}

export default async function useScriptProposal({mappingId, script, userInput}: {mappingId: number, script: string, userInput: string}) {
    console.log("Fetching a script proposal");
    const response: string = await(
        await fetch("http://localhost:8000/api/scripts/generate_sql",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mapping_id: mappingId,
                script: script,
                user_input: userInput,
            }),
        })
    ).json();
    //const response = mockData;
    console.log("Fetched script proposal");
    return response;
}
