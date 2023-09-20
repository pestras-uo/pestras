import { RecordWorkflow, WorkflowAction } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";

export function getByRecord(this: RecordWorkflowModel, ds: string, record: string) {
  return this.db.collection<RecordWorkflow>(`workflow_${ds}`).find({ record }, { sort: [['receive_date', 1 ]] }).toArray();
}

export function getWfStep(this: RecordWorkflowModel, ds: string, step: string) {
  return this.db.collection<RecordWorkflow>(`workflow_${ds}`).findOne({ step });
}

export function getRecordWfState(this: RecordWorkflowModel, ds: string, record: string) {
  return this.db.collection<RecordWorkflow>(`workflow_${ds}`)
    .findOne({ record, action: WorkflowAction.REVIEW });
}