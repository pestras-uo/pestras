import { WorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";

export async function create(
  this: RecordWorkflowModel,
  ds: string,
  record: string
) {
  return this.db.collection(`workflow_${ds}`).insertOne({
    record,
    state: WorkflowState.DRAFT,
    approve_date: null
  });
}