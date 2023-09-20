import { User, WorkflowAction, getWorkflowStepAction } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel, workflowModel } from "../../models";

export async function reject(
  this: RecordWorkflowModel,
  dsSerial: string,
  step: string,
  message: string,
  issuer: User
) {
  const ds = await dataStoresModel.getBySerial(dsSerial, { serial: 1, settings: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  const wfStep = await this.getWfStep(dsSerial, step);

  if (!wfStep)
    throw new HttpError(HttpCode.NOT_FOUND, 'workflowStepNotFound');

  wfStep.actions = wfStep.actions.map(a =>
    a.user === issuer.serial
      ? { ...a, action: WorkflowAction.REJECT }
      : a
  );

  const wf = await workflowModel.getBySerial(wfStep.workflow);
  const wfStepOpt = wf.steps.find(o => o.serial === step);
  const isOver = getWorkflowStepAction(wfStep.actions, wfStepOpt.algo);

  if (isOver !== WorkflowAction.REJECT) {
    await this.db.collection(`workflow_${dsSerial}`).updateOne({ step, 'actions.user': issuer.serial }, {
      $set: {
        'action.$': { user: issuer.serial, action: WorkflowAction.REJECT, date: new Date(), message }
      }
    });

  } else {
    // if was not delete trigger, put record back to draft 
    if (wfStep.trigger !== "delete") {
      const record = await this.db.collection(`review_${dsSerial}`).findOne({ serial: wfStep.record })
      await this.db.collection(`draft_${dsSerial}`).insertOne(record);
      await this.db.collection(`review_${dsSerial}`).deleteOne({ serial: wfStep.record });
    }
  }

  return true;
}