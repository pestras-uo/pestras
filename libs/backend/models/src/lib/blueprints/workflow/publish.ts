import { EntityTypes, RecordWorkflow, Role, TableDataRecord, User, WorkflowState } from "@pestras/shared/data-model";
import { RecordWorkflowModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function publish(
  this: RecordWorkflowModel,
  ds: string,
  serial: string,
  issuer: User
) {
  const record = await this.db.collection<TableDataRecord>(`${ds}`).findOne({ serial });

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  if (record['workflow'] === WorkflowState.APPROVED || record['workflow'] === WorkflowState.PENDING)
    return record['workflow'];

  const state = issuer.roles.includes(Role.ADMIN) || issuer.roles.includes(Role.DATA_ENG)
    ? WorkflowState.APPROVED
    : WorkflowState.PENDING;

  await this.db.collection<RecordWorkflow>(`workflow_${ds}`).updateOne({ serial }, {
    $set: { workflow: state }
  });

  this.pubSub.emitActivity({
    method: 'publish',
    create_date: new Date(),
    serial,
    entity: EntityTypes.RECORD,
    issuer: issuer.serial,
    payload: { data_Store: ds, state }
  });

  return state;
}