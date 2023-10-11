import { DataRecordState, RecordWorkflow, TableDataRecord, User, getWorkflowStepAction } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { workflowModel } from "../../models";

export async function reject(
  this: RecordWorkflowModel,
  dsSerial: string,
  recSerial: string,
  step: string,
  message: string,
  issuer: User
): Promise<DataRecordState> {
  const date = new Date();
  const activeWf = await this.getRecordActiveWf(dsSerial, recSerial);
  const recordWorkFlowCol = this.db.collection<RecordWorkflow>(`workflow_${dsSerial}`);

  if (!activeWf)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordWorkflowNotFound');

  const wfStep = activeWf.steps.find(s => s.step === step);

  if (!wfStep)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordWorkflowStepNotFound');

  wfStep.actions = wfStep.actions.map(a =>
    a.user === issuer.serial
      ? { ...a, action: 'reject', date, message }
      : a
  );

  const wf = await workflowModel.getBySerial(activeWf.workflow);

  if (!wf)
    throw new HttpError(HttpCode.NOT_FOUND, 'workflowNotFound');

  const wfStepOpt = wf.steps.find(o => o.serial === step);
  const stepState = wfStepOpt ? getWorkflowStepAction(wfStep.actions, wfStepOpt.algo) : 'review';

  if (stepState === 'reject') {

    await recordWorkFlowCol.updateOne(
      { record: recSerial, 'steps.step': step },
      {
        $set: {
          end_date: date,
          state: 'reject',
          'steps.$.actions': wfStep.actions,
          'steps.$.end_date': date,
          'steps.$.state': 'reject'
        }
      }
    );

    // if was not delete trigger, put record back to draft 
    if (activeWf.trigger !== "delete") {
      const record = await this.db.collection<TableDataRecord>(`review_${dsSerial}`).findOne({ serial: recSerial });

      if (record) {
        await this.db.collection<TableDataRecord>(`draft_${dsSerial}`).insertOne(record);
        await this.db.collection<TableDataRecord>(`review_${dsSerial}`).deleteOne({ serial: recSerial });
      }

      return 'draft';
    }

    return 'published';
  }

  await recordWorkFlowCol.updateOne(
    { record: recSerial, 'steps.step': step },
    { $set: { 'steps.$.actions': wfStep.actions } }
  );

  return 'review';
}