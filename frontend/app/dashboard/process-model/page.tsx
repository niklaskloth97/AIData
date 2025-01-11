"use client";

import PageHeader from "@/components/PageHeader";
import ProcessModelContent from "./content";

export default function Page() {
  return (
    <>
      <PageHeader
        heading="Process Model"
        subtext="View and manage your process model."
      />
      <ProcessModelContent />
    </>
  );
}
