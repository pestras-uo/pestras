// Workflow Step State
// ----------------------------------------------------------------------------------------------
export const workflowState = ['approve', 'reject', 'review'] as const;
export type WorkflowState = typeof workflowState[number];

export const workflowTriggers = ['create', 'update', 'delete'] as const;
export type WorkflowTriggers = typeof workflowTriggers[number];

export interface UserWorkflowAction {
  user: string;
  action: WorkflowState;
  date: Date | null;
  message: string;
}

export interface RecordWorkflowStep {
  actions: UserWorkflowAction[];
  /** party step serial */
  step: string;
  /** evaluated step action */
  state: WorkflowState;
  start_date: Date;
  end_date: Date | null;
}

/** Single workflow */
export interface RecordWorkflow {
  serial: string;
  trigger: WorkflowTriggers;
  state: WorkflowState;
  start_date: Date;
  end_date: Date | null;
  /** workflow deffinition serial */
  workflow: string;
  initMessage: string;
  steps: RecordWorkflowStep[];
}

export interface RecordWorkflowState {
  record: string;
  workflows: RecordWorkflow[];
}


// Workflow Definition
// ----------------------------------------------------------------------------------------------
export const workflowStepAlgo = [
  'any',
  'any_all',
  'all_any',
  'any_most',
  'most_any',
  /** only if curr step users count is odd */
  'most'
] as const;

export type WorkflowStepAlgo = typeof workflowStepAlgo[number];

export interface WorkflowStepOptions {
  serial: string;
  next_step: string | null;
  users: string[];
  algo: WorkflowStepAlgo;
  /** max days to wait for an action */
  max_review_days: number;

  /** 
   * in case user is:
   * - inactive
   * - by_pass and no alternatives found
   * - exceeds review limit
   */
  default_action: Exclude<WorkflowState, 'review'>;
}

export interface Workflow {
  serial: string;
  blueprint: string;

  name: string;

  /** users to approve */
  steps: WorkflowStepOptions[];
}

export function getWorkflowStepAction(actions: UserWorkflowAction[], algo: WorkflowStepAlgo) {
  const length = actions.length;

  switch (algo) {
    case 'any':
      return actions.some(a => a.action === 'approve')
        ? 'approve'
        : actions.some(a => a.action === 'reject')
          ? 'reject'
          : 'review';
    case 'all_any':
      return actions.every(a => a.action === 'approve')
        ? 'approve'
        : actions.some(a => a.action === 'reject')
          ? 'reject'
          : 'review';
    case 'any_all':
      return actions.some(a => a.action === 'approve')
        ? 'approve'
        : actions.every(a => a.action === 'reject')
          ? 'reject'
          : 'review';
    case 'any_most':
      return actions.some(a => a.action === 'approve')
        ? 'approve'
        : actions.reduce((total, a) => total += (a.action === 'reject' ? 1 : 0), 0) > length / 2
          ? 'reject'
          : 'review';
    case 'most_any':
      return actions.reduce((total, a) => total += (a.action === 'approve' ? 1 : 0), 0) > length / 2
        ? 'approve'
        : actions.some(a => a.action === 'reject')
          ? 'reject'
          : 'review';
    case 'most':
      return actions.reduce((total, a) => total += (a.action === 'approve' ? 1 : 0), 0) > length / 2
        ? 'approve'
        : actions.reduce((total, a) => total += (a.action === 'reject' ? 1 : 0), 0) > length / 2
          ? 'reject'
          : 'review';
  }
}