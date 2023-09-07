/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore, DataStoreState, DataStoreType, EntityTypes, TableDataRecord, WorkflowState, parseValue, validateConstraint, validateValueType } from "@pestras/shared/data-model";
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function update(
  this: DataRecordsModel,
  dataStore: DataStore,
  recordSerial: string,
  input: { group: string; data: any; },
  issuer: string
) {
  const group = input.group;
  const data = input.data;

  // type must be table
  if (dataStore.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, 'unsupportedDataStoreType');

  if (dataStore.state === DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreNotBuiltYet');

  const record = await this.getBySerial<TableDataRecord>(dataStore.serial, recordSerial);

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  // check workflow
  if (record['workflow'] === WorkflowState.PENDING)
    throw new HttpError(HttpCode.FORBIDDEN, 'recordInPendingState');

  // workflow state is approved and history not enabled then stop request
  if (dataStore.settings.workflow && record['workflow'] === WorkflowState.APPROVED && !dataStore.settings.history)
    throw new HttpError(HttpCode.FORBIDDEN, 'updatesNotAllowed');

  const update: any = {};
  const fields = dataStore.fields.filter(f => !f.system && !f.automated && f.group === group);

  for (const field of fields) {
    if (field.constant && record[field.name] !== null)
      continue;

    let value = parseValue(data[field.name]);

    if (value === null) {
      if (field.required)
        throw new HttpError(HttpCode.BAD_REQUEST, `${field.name}IsRequired`);

      value = field.default ?? null;

    } else {
      value = validateValueType(value, field);

      if (value === null)
        throw new HttpError(HttpCode.BAD_REQUEST, `${field.name}InvalidType`);

      // validate constraints if provided and are restricted
      if (field.constraint && !validateConstraint(field.type, field.constraint, value))
        throw new HttpError(HttpCode.BAD_REQUEST, 'valueNotMatchConstraints');

      if (field.unique) {
        const exists = (await this.db.collection(dataStore.serial).countDocuments({ [field.name]: value })) > 0;

        if (exists)
          throw new HttpError(HttpCode.CONFLICT, 'valueAlreadyExists', { field: field.name });
      }
    }

    update[field.name] = value;
  }

  const date = new Date();

  update.last_modified = date;

  await this.db.collection(dataStore.serial).updateOne({ serial: recordSerial }, { $set: update });

  if (dataStore.settings.history)
    this.pushHistory(dataStore.serial, record, Object.keys(data));

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'update',
    serial: dataStore.serial,
    entity: EntityTypes.RECORD,
    payload: { data_store: dataStore.serial }
  });

  return this.getBySerial<TableDataRecord>(dataStore.serial, recordSerial);
}