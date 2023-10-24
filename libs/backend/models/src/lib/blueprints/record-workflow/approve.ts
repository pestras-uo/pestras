import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataRecordsModel, dataStoresModel, notificationsModel, workflowModel } from "../../models";
import { ApproveNotification, DataRecordState, RecordWorkflow, TableDataRecord, User, getWorkflowStepAction } from "@pestras/shared/data-model";

export async function approve(
  this: RecordWorkflowModel,
  dsSerial: string,
  recSerial: string,
  step: string,
  message: string,
  issuer: User
): Promise<DataRecordState | null> {
  const date = new Date();
  const activeWf = await this.getRecordActiveWf(dsSerial, recSerial);
  const recordWorkFlowCol = this.db.collection<RecordWorkflow>(`workflow_${dsSerial}`);

  if (!activeWf)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordWorkflowNotFound');

  const wfStep = activeWf.steps.find(s => s.step === step);

  if (!wfStep)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordWorkflowStepNotFound');

  const wf = await workflowModel.getBySerial(activeWf.workflow);

  if (!wf)
    throw new HttpError(HttpCode.NOT_FOUND, 'workflowNotFound');

  const currStepIndex = wf.steps.findIndex(p => p.serial === step);

  if (currStepIndex === -1)
    throw new HttpError(HttpCode.EXPECTATION_FAILED, 'workflowStepDefNotFound');

  const wfStepOpt = wf.steps[currStepIndex];

  wfStep.actions = wfStep.actions.map(a =>
    a.user === issuer.serial
      ? { ...a, action: 'approve', date, message }
      : a
  );

  const stepState = getWorkflowStepAction(wfStep.actions, wfStepOpt.algo);
  const reviewCol = this.db.collection<TableDataRecord>(`review_${dsSerial}`);

  if (stepState === 'approve') {

    // is last step
    if (currStepIndex === wf.steps.length - 1) {
      const ds = await dataStoresModel.getBySerial(dsSerial, { settings: 1 });

      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

      const mainCol = this.db.collection<TableDataRecord>(dsSerial);
      const record = await reviewCol.findOne({ serial: recSerial }, { projection: { _id: 0 } });

      if (!record)
        throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

      // push current state to history 
      if (ds.settings.history) {
        const currState = await mainCol.findOne({ serial: recSerial });

        if (currState)
          dataRecordsModel.pushHistory(dsSerial, currState);
      }

      if (activeWf.trigger === 'delete')
        await mainCol.deleteOne({ serial: recSerial });
      else
        await mainCol.replaceOne({ serial: recSerial }, record, { upsert: true });

      await reviewCol.deleteOne({ serial: recSerial });
      await recordWorkFlowCol.updateOne(
        { record: recSerial, 'workflows.serial': activeWf.serial },
        {
          $set: {
            'workflows.$.end_date': date,
            'workflows.$.state': 'approve',
            'workflows.$.steps.$[step].actions': wfStep.actions,
            'workflows.$.steps.$[step].end_date': date,
            'workflows.$.steps.$[step].state': 'approve'
          }
        },
        { arrayFilters: [{ 'step.step': step }] }
      );

      await notificationsModel.notify<ApproveNotification>({
        data_store: dsSerial,
        date: new Date(),
        record: record['serial'],
        seen: null,
        target: record['owner'],
        topic: record['topic'] ?? null,
        trigger: activeWf.trigger,
        type: 'approve'
      });

      return activeWf.trigger === 'delete' ? null : 'published';

    } else {
      const nextStep = wf.steps[currStepIndex + 1];

      await this.db.collection(`workflow_${dsSerial}`).updateOne(
        { record: recSerial, 'workflows.serial': activeWf.serial },
        {
          $set: {
            'workflows.$.steps.$[step].actions': wfStep.actions,
            'workflows.$.steps.$[step].end_date': date,
            'workflows.$.steps.$[step].state': 'approve'
          }
        },
        { arrayFilters: [{ 'step.step': step }] }
      );
      await this.db.collection(`workflow_${dsSerial}`).updateOne(
        { record: recSerial, 'workflows.serial': activeWf.serial },
        {
          $push: {
            'workflows.$.steps': {
              actions: nextStep.users.map(u => ({ user: u, action: 'review', date: null, message: '' })),
              step: nextStep.serial,
              state: 'review',
              start_date: date,
              end_date: null
            }
          }
        });

      await notificationsModel.notifyMany<ApproveNotification>(nextStep.users.map(u => {
        return {
          data_store: dsSerial,
          date: new Date(),
          record: recSerial,
          seen: null,
          target: u,
          topic: activeWf.topic,
          trigger: activeWf.trigger,
          type: 'approve'
        }
      }));

      return 'review';
    }
  }

  await this.db.collection(`workflow_${dsSerial}`).updateOne(
    { record: recSerial, 'workflows.serial': activeWf.serial },
    { $set: { 'workflows.$.steps.$[step].actions': wfStep.actions } },
    { arrayFilters: [{ 'step.step': step }] }
  );

  return 'review';
}