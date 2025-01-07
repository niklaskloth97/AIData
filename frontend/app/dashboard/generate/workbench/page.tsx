'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STEP_CONFIG } from './workflowState';
import { WorkflowProvider } from './workflowContext';
import PageHeader from "@/components/PageHeader";

export default function WorkbenchPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(STEP_CONFIG['case-id-builder'].path);
  }, [router]);

  return (
    <WorkflowProvider>
      <PageHeader 
        heading="Workbench" 
        subtext="Create your event log step by step" 
      />
    </WorkflowProvider>
  );
}