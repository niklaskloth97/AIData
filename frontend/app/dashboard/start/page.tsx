"use client";

import React from "react";
import PageHeader from "@/components/PageHeader"; // Adjust this import based on your folder structure
import ExampleFlow from "./ExampleFlow"; // Adjust this path if necessary

const Page: React.FC = () => {
  return (
    <>
      <PageHeader heading="Welcome User!" subtext="This is the subtext." />
      <div className="mt-6" style={{ height: "80vh" }}>
        <ExampleFlow />
      </div>
    </>
  );
};

export default Page;
