"use client";
import React, { useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { DataTable } from "@/components/DataTable";
import { columns, TableData } from "@/app/dashboard/generate/workbench/script-proposal/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";


const initialSQL = `CREATE TABLE currency_conversion AS
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
ORDER BY total_value_in_eur DESC;`;

const sampleData: TableData[] = [
  { caseId: 1001, activity: "delivery_made", timestamp: "2024-11-01 09:00 AM", otherAttributes: "{Username: Alice, Price: $5, Amount Of Pieces: 6}" },
  { caseId: 1002, activity: "delivery_made", timestamp: "2024-11-02 10:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
  { caseId: 1003, activity: "delivery_made", timestamp: "2024-11-03 09:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
  { caseId: 1004, activity: "delivery_made", timestamp: "2024-11-04 11:00 AM", otherAttributes: "{Username: Jan, PaymentMade: False, Success: False}" },
  { caseId: 1005, activity: "delivery_made", timestamp: "2024-11-06 12:00 AM", otherAttributes: "{Username: Sandro, PaymentMethod: Paypal, Success: True}" },
  { caseId: 1006, activity: "delivery_made", timestamp: "2024-11-07 08:00 AM", otherAttributes: "{Username: Jan, PaymentMade: True, Success: True}" },
];

export default function Page() {
  const [sql, setSql] = useState(initialSQL);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="p-6 rounded-md grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
        <h2 className="text-xl font-bold mb-4">SQL Script Proposal for Delivery Mapping</h2>
        <SyntaxHighlighter
          language="sql"
          editable="true"  // ← Change to a string
          value={initialSQL}
          onChange={(value: string) => setSql(value)}
          className="border border-gray-200 rounded p-2 bg-gray-50"
        >
          {""}
        </SyntaxHighlighter>
        <div className="flex justify-between mt-4">
          <Button variant="secondary" onClick={() => alert("Mappings Edited")}>Edit Mappings</Button>
          <Button variant="destructive" onClick={() => alert("Changes Discarded")}>Discard Changes</Button>
          <Button onClick={() => alert("Script Regenerated")}>ReGenerate</Button>
          <Button onClick={() => alert("Script Exported")}>Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-subgrid gap-4">
        {/* 2nd card: "Add Feedback" */}
        <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
          <h2 className="text-xl font-bold mb-4">Add Feedback</h2>
          <div className="">
            <Label htmlFor="message">Your message</Label>
            <Textarea placeholder="Type your feedback to the AI here." id="feedback" />
          </div>
        </div>
      
      {/* 3rd card: "Event Log Preview" */}
        <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
          <h2 className="text-xl font-bold mb-4">Event Log Preview</h2>
          <DataTable columns={columns} data={sampleData} />
        </div>
      </div>
    </div>
  );
}
