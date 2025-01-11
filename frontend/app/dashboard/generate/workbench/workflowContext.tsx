'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams} from 'next/navigation';
import { WorkflowState, WorkflowStep, STEP_CONFIG } from './workflowState';

interface WorkflowContextType {
  currentStep: WorkflowStep;
  nextStep: () => void;
  previousStep: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<WorkflowState>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('workflowState');
      if (saved) return JSON.parse(saved);
    }
    return { currentStep: 'case-id-builder', completed: [] };
  });

  useEffect(() => {
    sessionStorage.setItem('workflowState', JSON.stringify(state));
    router.push(STEP_CONFIG[state.currentStep].path);
  }, [state, router]);

  const nextStep = () => {
    setState(prev => {
      const steps = Object.keys(STEP_CONFIG) as WorkflowStep[];
      const currentIndex = steps.indexOf(prev.currentStep);
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        return {
          currentStep: nextStep,
          completed: [...prev.completed, prev.currentStep]
        };
      }
      return prev;
    });
  };

  const previousStep = () => {
    setState(prev => {
      const steps = Object.keys(STEP_CONFIG) as WorkflowStep[];
      const currentIndex = steps.indexOf(prev.currentStep);
      if (currentIndex > 0) {
        const prevStep = steps[currentIndex - 1];
        return {
          currentStep: prevStep,
          completed: prev.completed.filter(step => step !== prev.currentStep)
        };
      }
      return prev;
    });
  };

  return (
    <WorkflowContext.Provider value={{ currentStep: state.currentStep, nextStep, previousStep }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflow must be used within WorkflowProvider');
  return context;
};