import { EntityTypes, Role, TableDataRecord, User, WorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function approve(
  this: RecordWorkflowModel,
  ds: string,
  serial: string,
  issuer: User
) {
  const record = await this.db.collection<TableDataRecord>(`${ds}`).findOne({ serial });

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  if (record['workflow'] === WorkflowState.APPROVED)
    return true;

  if (record['workflow'] === WorkflowState.DRAFT)
    throw new HttpError(HttpCode.FORBIDDEN, 'noPublishRequestMade');

  if (!issuer.roles.includes(Role.ADMIN) && !issuer.roles.includes(Role.DATA_ENG))
    throw new HttpError(HttpCode.UNAUTHORIZED, 'unathorizedApprove');

  await this.db.collection<TableDataRecord>(`${ds}`).updateOne({ serial }, {
    $set: { workflow: WorkflowState.APPROVED }
  });

  this.pubSub.emitActivity({
    method: 'workflowApprove',
    create_date: new Date(),
    serial,
    entity: EntityTypes.WORKFLOW,
    issuer: issuer.serial,
    payload: { data_store: ds },
  });

  return true;
}