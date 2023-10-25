import { EntityTypes, PublishNotification, RecordWorkflow, RecordWorkflowState, User, WorkflowTriggers } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel, notificationsModel, workflowModel } from "../../models";
import { Serial } from "@pestras/shared/util";

export async function publishRecord(
  this: RecordWorkflowModel,
  dsSerial: string,
  serial: string,
  trigger: WorkflowTriggers,
  issuer: User,
  msg?: string
) {
  // check if currently has in review action
  const activeRecordWf = await this.getRecordActiveWf(dsSerial, serial);

  if (activeRecordWf)
    throw new HttpError(HttpCode.FORBIDDEN, 'recordHasAnActiveWorkflowReview');

  const mainCol = this.db.collection(dsSerial);
  const reviewCol = this.db.collection(`review_${dsSerial}`);
  const draftCol = this.db.collection(`draft_${dsSerial}`);
  const ds = await dataStoresModel.getBySerial(dsSerial, { serial: 1, settings: 1, blueprint: 1 });

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
      issuer: issuer.serial,
      topic: record['topic'] ?? null,
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

    await recordWorkFlowCol.updateOne({ record: record['serial'] }, { $push: { workflows: recordWorkflow } }, { upsert: true });
    await reviewCol.insertOne(record);
    await draftCol.deleteOne({ serial });

    this.channel.emitActivity({
      create_date: new Date(),
      entity: EntityTypes.RECORD,
      issuer: issuer.serial,
      method: 'publish',
      serial: record['serial']
    });

    await notificationsModel.notifyMany<PublishNotification>(firstParty.users.map<Omit<PublishNotification, 'serial'>>(u => {
      return {
        target: u,
        date: new Date(),
        record: record['serial'],
        trigger,
        seen: null,
        type: 'publish',
        data_store: ds.serial,
        topic: record['topic'] ?? null
      };
    }));

  } else if (!ds.settings.workflow[trigger]) {
    throw new HttpError(HttpCode.FORBIDDEN, `${trigger}NotAllowed`);

  } else {
    await mainCol.replaceOne({ serial }, record, { upsert: true });
    await draftCol.deleteOne({ serial });
  }

  return true;
}