"use client";
import { WorkflowProvider } from './workflowContext';

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkflowProvider>{children}</WorkflowProvider>;
}