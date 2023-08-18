export enum WorkflowAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  NONE = 'none'
}

export interface WorkflowPartyState {
  user: string;
  action: WorkflowAction;
  receive_date: Date | null;
  action_date: Date | null;
  /** in case one of the user alternatives made the action */
  action_by: string;
}

export interface RecordWorkflow {
  /** One to one relation no need for serial */
  record: string;
  /** reference to workflow settings */
  workflow: string;

  state: WorkflowPartyState[];
}

export enum WorkflowUpdateRole {
  RE_RUN = 're_run',
  BY_PASS = 'by_pass',
  BLOCK = 'block'
}

export interface Workflow {
  serial: string;
  blueprint: string;
  /** in case user is inactive or in state of by_pass and no alternatives found */
  default_action: Exclude<WorkflowAction, WorkflowAction.NONE>;

  /**
   * ### On Record Update
   *  - **by_pass**: apply update directly
   *  - **re_run**: re run workflow
   *  - **block**: prevent any update
   */
  update_role: WorkflowUpdateRole;

  parties: string[];
}