import { EntityTypes, RecordWorkflow, Role, TableDataRecord, User, WorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function reject(
  this: RecordWorkflowModel,
  ds: string,
  serial: string,
  issuer: User
) {
  const record = await this.db.collection<TableDataRecord>(`${ds}`).findOne({ serial });

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  if (record['workflow'] === WorkflowState.APPROVED && !issuer.roles.includes(Role.ADMIN) && !issuer.roles.includes(Role.DATA_ENG))
    throw new HttpError(HttpCode.UNAUTHORIZED, 'unathorizedCancel');

  if (record['workflow'] === WorkflowState.DRAFT)
    return true;

  await this.db.collection<RecordWorkflow>(`workflow_${ds}`).updateOne({ serial }, {
    $set: { workflow: WorkflowState.DRAFT }
  });

  this.pubSub.emitActivity({
    method: 'reject',
    create_date: new Date(),
    serial,
    entity: EntityTypes.WORKFLOW,
    issuer: issuer.serial,
    payload: { data_store: ds }
  });

  return true;
}