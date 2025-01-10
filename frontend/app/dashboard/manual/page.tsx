"use client"

import PageHeader from "@/components/PageHeader";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css"; 
import "/styles/markdown.css"; 


const UserManual: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string>("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("/user-manual.md");
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Failed to load markdown file:", error);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <>
    <PageHeader heading="Manual" subtext="Read more about the steps"/>
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {/* Main Content */}
      <div className="flex">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
      {/* Sidebar */}
      <aside>
        <h3>User Manual</h3>
        <ul>
          <li><a href="#process-overview">Process Overview</a></li>
          <li><a href="#upload-files">Upload Files</a></li>
          <li><a href="#connect-databases">Connect Database(s)</a></li>
          <li><a href="#ai-performs-initial-analysis">AI Performs Initial Analysis</a></li>
          <li><a href="#human-browses-checks-and-corrects-model">Human Browses, Checks, and Corrects Model</a></li>
          <li><a href="#welcome-to-the-system">Instantiate Data Model</a></li>
          <li><a href="#welcome-to-the-system">Use Workbench to Create Scripts</a></li>
          <li><a href="#welcome-to-the-system">Use Testbench to Create Short Demo Logs</a></li>
        </ul>
      </aside>
    </div>
    </>
  );
};

export default UserManual;