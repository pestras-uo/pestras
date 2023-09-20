import { RecordWorkflow } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { workflowModel } from "../../models";
import { HttpCode, HttpError } from "@pestras/backend/util";

export async function cancel(
  this: RecordWorkflowModel,
  dsSerial: string,
  serial: string
) {
  const recordWf = await this.db.collection<RecordWorkflow>(`workflow_${dsSerial}`).findOne({ record: serial }, { projection: { workflow: 1 } });

  if (!recordWf)
    return true;

  const wf = await workflowModel.getBySerial(recordWf.workflow);

  if (!wf.cancalable)
    throw new HttpError(HttpCode.FORBIDDEN, 'workflowIsNotCancelable');

  const reviewCol = this.db.collection(`review_${dsSerial}`);
  const draftCol = this.db.collection(`draft_${dsSerial}`);
  const record = await reviewCol.findOne({ serial }, { projection: { _id: 0 } });

  await this.db.collection(`workflow_${dsSerial}`).deleteMany({ record: serial });

  if (record) {
    await draftCol.insertOne(record);
    await reviewCol.deleteOne({ serial });
  }

  return true;
}