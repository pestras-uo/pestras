import { WorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";

export async function create(
  this: RecordWorkflowModel,
  ds: string,
  record: string
) {
  const wf = {
    record,
    state: WorkflowState.DRAFT,
    approve_date: null
  }
  await this.db.collection(`workflow_${ds}`).insertOne(wf);

  return wf;
}