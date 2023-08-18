import { RecordWorkflow } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";

export function getByRecord(this: RecordWorkflowModel, ds: string, record: string) {
  return this.db.collection<RecordWorkflow>(`workflow_${ds}`).findOne({ record });
}