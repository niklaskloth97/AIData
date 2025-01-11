export type WorkflowStep = 'case-id-builder' | 'workbench-mapping-editor' | 'script-proposal';

export interface WorkflowState {
  currentStep: WorkflowStep;
  completed: WorkflowStep[];
}
export const INITIAL_STEP: WorkflowStep = 'case-id-builder';
export const WORKFLOW_STEPS: WorkflowStep[] = [
  'case-id-builder',
  'workbench-mapping-editor', 
  'script-proposal'
];

export const STEP_CONFIG = {
  'case-id-builder': {
    title: 'Case ID Builder',
    path: '/dashboard/generate/workbench/case-id-builder'
  },
  'workbench-mapping-editor': {
    title: 'Mapping Editor',
    path: '/dashboard/generate/workbench/workbench-mapping-editor'
  },
  'script-proposal': {
    title: 'Script Proposal',
    path: '/dashboard/generate/workbench/script-proposal'
  }
};