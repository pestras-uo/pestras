import { RecordWorkflow, RecordWorkflowState, WorkflowTriggers } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel, workflowModel } from "../../models";
import { Serial } from "@pestras/shared/util";

export async function publishRecord(
  this: RecordWorkflowModel,
  dsSerial: string,
  serial: string,
  trigger: WorkflowTriggers,
  msg?: string
) {
  // check if currently has in review action
  const activeRecordWf = await this.getRecordActiveWf(dsSerial, serial);

  if (activeRecordWf)
    throw new HttpError(HttpCode.FORBIDDEN, 'recordHasAnActiveWorkflowReview');

  const mainCol = this.db.collection(dsSerial);
  const reviewCol = this.db.collection(`review_${dsSerial}`);
  const draftCol = this.db.collection(`draft_${dsSerial}`);
  const ds = await dataStoresModel.getBySerial(dsSerial, { serial: 1, settings: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  const record = trigger === 'delete'
    ? await mainCol.findOne({ serial }, { projection: { _id: 0 } })
    : await draftCol.findOne({ serial }, { projection: { _id: 0 } });

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  if (typeof ds.settings.workflow[trigger] === 'string') {
    const workflow = await workflowModel.getBySerial(ds.settings.workflow[trigger] as string);
    const recordWorkFlowCol = this.db.collection<RecordWorkflowState>(`workflow_${ds.serial}`);

    if (!workflow)
      throw new HttpError(HttpCode.NOT_FOUND, 'workflowNotFound');

    const firstParty = workflow.steps[0];
    const recordWorkflow: RecordWorkflow = {
      serial: Serial.gen('RWF'),
      trigger,
      workflow: workflow.serial,
      state: 'review',
      start_date: new Date(),
      end_date: null,
      initMessage: msg ?? '',
      steps: [{
        actions: firstParty.users.map(u => ({ user: u, action: 'review', date: new Date(), message: '' })),
        start_date: new Date(),
        end_date: null,
        state: 'review',
        step: workflow.steps[0].serial
      }]
    }

    await recordWorkFlowCol.updateOne({ record }, { $push: { workflows: recordWorkflow } });
    await reviewCol.insertOne(record);
    await draftCol.deleteOne({ serial });

  } else if (!ds.settings.workflow[trigger]) {
    throw new HttpError(HttpCode.FORBIDDEN, `${trigger}NotAllowed`);

  } else {
    await mainCol.replaceOne({ serial }, record, { upsert: true });
    await draftCol.deleteOne({ serial });
  }

  return true;
}