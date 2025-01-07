"use client";

import PageHeader from "@/components/PageHeader";
import DatabasesContent from "./DatabasesContent";

export default function Page() {
  return (
    <>
      <PageHeader
        heading="Databases"
        subtext="Manage your connected databases here."
      />
      <DatabasesContent />
    </>
  );
}
