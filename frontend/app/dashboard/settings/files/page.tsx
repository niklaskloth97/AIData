"use client";

import PageHeader from "@/components/PageHeader";
import FilesContent from "./FilesContent";

export default function Page() {
  return (
    <>
      <PageHeader
        heading="Files"
        subtext="Manage your uploaded files here."
      />
      <FilesContent />
    </>
  );
}
