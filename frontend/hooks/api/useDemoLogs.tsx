import { useQuery } from "@tanstack/react-query";
import { StringOrTemplateHeader } from "@tanstack/react-table";
import { request } from "http";

export interface DemoLogs {
    status: string;
    data: object;
}

export default async function useDemoLogs({sql}: {sql: string}) {
    console.log("Fetching a demo log");
    const response: DemoLogs = await(
        await fetch("http://localhost:8000/api/scripts/execute",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body: "",
                sqlscript: sql,
            }),
        })
    ).json();
    //const response = mockData;
    console.log("Fetched demo log");
    return response;
}
