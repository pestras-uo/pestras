import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataRecordsModel, dataStoresModel, workflowModel } from "../../models";
import { DataRecordState, RecordWorkflow, TableDataRecord, User, WorkflowAction, getWorkflowStepAction } from "@pestras/shared/data-model";

export async function approve(
  this: RecordWorkflowModel,
  dsSerial: string,
  step: string,
  message: string,
  issuer: User
): Promise<DataRecordState | null> {
  const wfStep = await this.getWfStep(dsSerial, step);
  const recordWorkFlowCol = this.db.collection<RecordWorkflow>(`workflow_${dsSerial}`);

  if (!wfStep)
    throw new HttpError(HttpCode.NOT_FOUND, 'workflowStepNotFound');

  const wf = await workflowModel.getBySerial(wfStep.workflow);

  if (!wf)
    throw new HttpError(HttpCode.NOT_FOUND, 'workflowNotFound');

  const currStepIndex = wf.steps.findIndex(p => p.serial === step);

  if (currStepIndex === -1)
    throw new HttpError(HttpCode.EXPECTATION_FAILED, 'workflowStepDefNotFound');

  const wfStepOpt = wf.steps[currStepIndex];

  wfStep.actions = wfStep.actions.map(a =>
    a.user === issuer.serial
      ? { ...a, action: WorkflowAction.APPROVE }
      : a
  );
  
  const isOver = getWorkflowStepAction(wfStep.actions, wfStepOpt.algo);

  if (isOver === WorkflowAction.APPROVE) {

    // is last step
    if (currStepIndex === wf.steps.length - 1) {
      const ds = await dataStoresModel.getBySerial(dsSerial, { settings: 1 });

      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

      const mainCol = this.db.collection<TableDataRecord>(dsSerial);
      const reviewCol = this.db.collection<TableDataRecord>(`review_${dsSerial}`);
      const record = await reviewCol.findOne({ serial: wfStep.record }, { projection: { _id: 0 } });

      // push current state to history 
      if (ds.settings.history) {
        const currState = await mainCol.findOne({ serial: wfStep.record });

        if (currState)
          dataRecordsModel.pushHistory(dsSerial, currState);
      }

      if (!record)
        throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

      if (wfStep.trigger === 'delete')
        await mainCol.deleteOne({ serial: wfStep.record });
      else
        await mainCol.replaceOne({ serial: wfStep.record }, record, { upsert: true });

      await reviewCol.deleteOne({ serial: wfStep.record });
      await recordWorkFlowCol.deleteMany({ record: wfStep.record });

      return wfStep.trigger ? null : DataRecordState.PUBLISHED;

    } else {
      await this.db.collection(`workflow_${dsSerial}`).updateOne({ step, 'actions.user': issuer.serial }, {
        $set: {
          action: WorkflowAction.APPROVE,
          action_date: new Date(),
          'action.$': { user: issuer.serial, action: WorkflowAction.APPROVE, date: new Date(), message }
        }
      });

      const nextStep = wf.steps[currStepIndex + 1];
      const recordWorkFlow: RecordWorkflow = {
        actions: nextStep.users.map(u => ({ user: u, action: WorkflowAction.REVIEW, date: null, message: '' })),
        record: wfStep.record,
        workflow: wf.serial,
        step: nextStep.serial,
        trigger: wfStep.trigger,
        action: isOver,
        create_date: new Date(),
        action_date: null
      };

      await recordWorkFlowCol.insertOne(recordWorkFlow);

      return DataRecordState.REVIEW;
    }
  }

  await this.db.collection(`workflow_${dsSerial}`).updateOne({ step, 'actions.user': issuer.serial }, {
    $set: { 'action.$': { user: issuer.serial, action: WorkflowAction.APPROVE, date: new Date(), message } }
  });

  return DataRecordState.REVIEW;
}