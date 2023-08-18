import { RecordWorkflowModel } from ".";

export async function deleteWorkflow(
  this: RecordWorkflowModel,
  ds: string,
  record: string
) {
  await this.db.collection(`workflow_${ds}`).deleteOne({ record });

  return true;
}