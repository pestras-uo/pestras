import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataRecordsModel, dataStoresModel, workflowModel } from "../../models";
import { DataRecordState, RecordWorkflow, TableDataRecord, User, getWorkflowStepAction } from "@pestras/shared/data-model";

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

  if (stepState === 'approve') {

    // is last step
    if (currStepIndex === wf.steps.length - 1) {
      const ds = await dataStoresModel.getBySerial(dsSerial, { settings: 1 });

      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

      const mainCol = this.db.collection<TableDataRecord>(dsSerial);
      const reviewCol = this.db.collection<TableDataRecord>(`review_${dsSerial}`);
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
        { record: recSerial, 'steps.step': step },
        {
          $set: {
            end_date: date,
            state: 'approve',
            'steps.$.actions': wfStep.actions,
            'steps.$.end_date': date,
            'steps.$.state': 'approve'
          }
        }
      );

      return activeWf.trigger === 'delete' ? null : 'published';

    } else {
      const nextStep = wf.steps[currStepIndex + 1];

      await this.db.collection(`workflow_${dsSerial}`).updateOne(
        { record: recSerial, 'steps.step': step },
        {
          $set: {
            'steps.$.actions': wfStep.actions,
            'steps.$.end_date': date,
            'steps.$.state': 'approve'
          },
          $push: {
            steps: {
              actions: nextStep.users.map(u => ({ user: u, action: 'review', date: null, message: '' })),
              step: nextStep.serial,
              state: 'review',
              start_date: date,
              end_date: null
            }
          }
        });

      return 'review';
    }
  }

  await this.db.collection(`workflow_${dsSerial}`).updateOne(
    { record: recSerial, 'steps.step': step },
    { $set: { 'steps.$.actions': wfStep.actions } }
  );

  return 'review';
}