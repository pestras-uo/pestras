export enum WorkflowState {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved'
}

export interface DataRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TableDataRecord extends DataRecord {
  serial: string;
  // relations
  topic: string | null;
  // workflow
  workflow: WorkflowState | null;
  
  owner: string;

  // dates
  create_date: Date;
  last_modified: Date;
}

export interface DataRecordHistroyItem {
  serial: string;
  record: string;
  last_modified: Date;
  changes: { [key: string]: unknown; };
}