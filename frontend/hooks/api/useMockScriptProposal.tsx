import { TableData } from "@/app/dashboard/generate/workbench/script-proposal/columns";
import { useQuery } from "@tanstack/react-query";

export interface mockData {
    initialSQL: string;
    sampleData: TableData[];
}

const mockData: mockData = {
    initialSQL: `CREATE TABLE currency_conversion AS
SELECT
  F.AWKEY,
  F.BLART,
  F.USNAM,
  F.WAERS AS currency_code,
  F.WWERT AS original_value,
  (F.WWERT * C.conversion_rate) AS value_in_eur
FROM filtered_process_log F
JOIN currency_table C ON F.WAERS = C.currency_code
WHERE EXTRACT(YEAR FROM F.CPUDT) = C.year;

-- Step 3: Create aggregated view
CREATE TABLE user_document_summary AS
SELECT
  USNAM AS user_name,
  BLART AS document_type,
  COUNT(AWKEY) AS total_documents,
  SUM(value_in_eur) AS total_value_in_eur,
  AVG(value_in_eur) AS average_value_in_eur
FROM currency_conversion
GROUP BY USNAM, BLART
ORDER BY total_value_in_eur DESC;`,

    sampleData: [
        { caseId: 1001, activity: "delivery_made", timestamp: "2024-11-01 09:00 AM", otherAttributes: "{Username: Alice, Price: $5, Amount Of Pieces: 6}" },
        { caseId: 1002, activity: "delivery_made", timestamp: "2024-11-02 10:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
        { caseId: 1003, activity: "delivery_made", timestamp: "2024-11-03 09:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
        { caseId: 1004, activity: "delivery_made", timestamp: "2024-11-04 11:00 AM", otherAttributes: "{Username: Jan, PaymentMade: False, Success: False}" },
        { caseId: 1005, activity: "delivery_made", timestamp: "2024-11-06 12:00 AM", otherAttributes: "{Username: Sandro, PaymentMethod: Paypal, Success: True}" },
        { caseId: 1006, activity: "delivery_made", timestamp: "2024-11-07 08:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
    ]
};

export default function useMockScriptProposal() {
    return useQuery({
        queryKey: ["mockScriptProposal"],
        queryFn: async () => {
            console.log("Fetching mock script proposal");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return mockData;
        },
    });
}