"use client";

import React from "react";
import PageHeader from "@/components/PageHeader"; // Adjust this import based on your folder structure
import ExampleFlow from "./ExampleFlow"; // Adjust this path if necessary

const Page: React.FC = () => {
  return (
    <>
      <PageHeader heading="Welcome Example User!" subtext="Enjoy this simple overview of the User Journey. For more details, visit the Manual." />
      <div className="mt-6" style={{ height: "80vh" }}>
        <ExampleFlow />
      </div>
    </>
  );
};

export default Page;
