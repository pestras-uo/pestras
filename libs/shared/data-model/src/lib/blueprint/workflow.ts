// Workflow State
// ----------------------------------------------------------------------------------------------
export enum WorkflowAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REVIEW = 'review'
}

export interface WorkflowPartyState {
  user: string;
  action: WorkflowAction;
  receive_date: Date | null;
  action_date: Date | null;
  /** fields names that current party has modified */
  changes: string[];
  /** in case one of the user alternatives made the action */
  action_by: string;
}

export interface RecordWorkflow {
  /** One to one relation no need for serial */
  record: string;
  /** reference to workflow settings */
  workflow: string;

  action: WorkflowTriggerActions;

  state: WorkflowPartyState[];
}


// Workflow Definition
// ----------------------------------------------------------------------------------------------
export enum WorkflowTriggerRole {
  RUN = 'run',
  BY_PASS = 'by_pass',
  BLOCK = 'block'
}

export enum WorkflowTriggerActions {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface WorkflowPartyOptions {
  user: string;
  /** Allow party to update specific fields */
  allow_change: string[];
}

/**
 * ### Actions state
 *  - **by_pass**: apply update directly
 *  - **run**: run workflow
 *  - **block**: prevent any update
 */
export interface WorkflowTriggerOptions {
  action: WorkflowTriggerActions;
  trigger: WorkflowTriggerRole;
  /** 
   * in case of update action:
   * spicify which fields to trigger workflow
   */
  fields: string[];
}

export interface Workflow {
  serial: string;
  blueprint: string;

  name: string;

  triggers: WorkflowTriggerOptions[];
  /** max days to wait for an action */
  max_review_days: number;

  /** 
   * in case user is:
   * - inactive
   * - by_pass and no alternatives found
   * - exceeds review limit
   */
  default_action: Exclude<WorkflowAction, WorkflowAction.REVIEW>;

  /** users to approve */
  parties: WorkflowPartyOptions[];
}