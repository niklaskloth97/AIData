"use client";

import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { createDatabaseColumns, DatabaseTableData } from "./columns";

// Dummy data for the table
const dummyData: DatabaseTableData[] = [
  {
    databaseName: "SAP",
    url: "jdbc:sapdb://sap.hilti.internal:1234/production",
    linkedInsights: "view extracted tables",
  },
  {
    databaseName: "SAP HANA",
    url: "jdbc:sapdb://hana.hilti.internal:1234/production",
    linkedInsights: "view extracted tables",
  },
  {
    databaseName: "HILTI Internal",
    url: "postgresql://postgres.processes.hilti.com:4321/prod",
    linkedInsights: "view extracted tables",
  },
  {
    databaseName: "More",
    url: "1004",
    linkedInsights: "view extracted tables",
  },
  {
    databaseName: "Databases",
    url: "1005",
    linkedInsights: "view extracted tables",
  },
];

export default function Page() {
  return (
    <>
      {/* Page Header */}
      <PageHeader heading="Databases" subtext="Manage your connected databases here." />

      {/* Table Section */}
      <div className="p-6">
        <DataTable columns={createDatabaseColumns} data={dummyData} />
      </div>
    </>
  );
}
