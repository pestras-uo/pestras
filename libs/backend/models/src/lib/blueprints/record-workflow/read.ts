import { RecordWorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpCode, HttpError } from "@pestras/backend/util";

export function getByRecord(this: RecordWorkflowModel, ds: string, record: string) {
  return this.db.collection<RecordWorkflowState>(`workflow_${ds}`).findOne({ record });
}

export async function getRecordActiveWf(this: RecordWorkflowModel, ds: string, record: string) {
  const wfs = await this.getByRecord(ds, record);

  if (wfs)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordWorkflowStateNotFound');

  return wfs.workflows.find(w => w.state === 'review') ?? null;
}