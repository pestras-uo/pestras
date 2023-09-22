// Workflow Step State
// ----------------------------------------------------------------------------------------------
export enum WorkflowAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REVIEW = 'review'
}

export const workflowTriggers = ['new', 'update', 'delete'] as const;

export type WorkflowTriggers = typeof workflowTriggers[number];

export interface UserWorkflowAction {
  user: string;
  action: WorkflowAction;
  date: Date;
  message: string;
}

export interface RecordWorkflow {
  actions: UserWorkflowAction[];
  /** One to one relation no need for serial */
  record: string;
  /** reference to workflow settings */
  workflow: string;
  /** party step serial */
  step: string;

  trigger: WorkflowTriggers;

  action: WorkflowAction;

  create_date: Date | null;

  action_date: Date | null;
}


// Workflow Definition
// ----------------------------------------------------------------------------------------------
export enum WorkflowPartyAlgo {
  ANY = 'any',
  ANY_ALL = 'any_all',
  ALL_ANY = 'all_any',
  ANY_MOST = 'any_most',
  MOST_ANY = 'most_any',
  /** only is parties are odd */
  MOST = 'most'
}

export interface WorkflowStepOptions {
  serial: string;
  users: string[];
  algo: WorkflowPartyAlgo
}

export interface Workflow {
  serial: string;
  blueprint: string;

  name: string;
  /** max days to wait for an action */
  max_review_days: number;

  cancelable: boolean;

  /** 
   * in case user is:
   * - inactive
   * - by_pass and no alternatives found
   * - exceeds review limit
   */
  default_action: Exclude<WorkflowAction, WorkflowAction.REVIEW>;

  /** users to approve */
  steps: WorkflowStepOptions[];
}

export function getWorkflowStepAction(actions: UserWorkflowAction[], algo: WorkflowPartyAlgo) {
  const length = actions.length;

  switch (algo) {
    case WorkflowPartyAlgo.ANY:
      return actions.some(a => a.action === WorkflowAction.APPROVE)
        ? WorkflowAction.APPROVE
        : actions.some(a => a.action === WorkflowAction.REJECT)
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
    case WorkflowPartyAlgo.ALL_ANY:
      return actions.every(a => a.action === WorkflowAction.APPROVE)
        ? WorkflowAction.APPROVE
        : actions.some(a => a.action === WorkflowAction.REJECT)
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
    case WorkflowPartyAlgo.ANY_ALL:
      return actions.some(a => a.action === WorkflowAction.APPROVE)
        ? WorkflowAction.APPROVE
        : actions.every(a => a.action === WorkflowAction.REJECT)
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
    case WorkflowPartyAlgo.ANY_MOST:
      return actions.some(a => a.action === WorkflowAction.APPROVE)
        ? WorkflowAction.APPROVE
        : actions.reduce((total, a) => total += (a.action === WorkflowAction.REJECT ? 1 : 0), 0) > length / 2
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
    case WorkflowPartyAlgo.MOST_ANY:
      return actions.reduce((total, a) => total += (a.action === WorkflowAction.APPROVE ? 1 : 0), 0) > length / 2
        ? WorkflowAction.APPROVE
        : actions.some(a => a.action === WorkflowAction.REJECT)
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
    case WorkflowPartyAlgo.MOST:
      return actions.reduce((total, a) => total += (a.action === WorkflowAction.APPROVE ? 1 : 0), 0) > length / 2
        ? WorkflowAction.APPROVE
        : actions.reduce((total, a) => total += (a.action === WorkflowAction.REJECT ? 1 : 0), 0) > length / 2
          ? WorkflowAction.REJECT
          : WorkflowAction.REVIEW;
  }
}