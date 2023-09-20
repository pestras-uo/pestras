/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordState, DataStoreState, DataStoreType, EntityTypes, TableDataRecord, parseValue, validateConstraint, validateValueType } from "@pestras/shared/data-model";
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel } from "../../models";

export type UpdateRecordInput = { group: string; data: TableDataRecord; draft: boolean; };

export async function update(
  this: DataRecordsModel,
  dsSerial: string,
  recordSerial: string,
  input: UpdateRecordInput,
  issuer: string
) {
  const ds = await dataStoresModel.getBySerial(dsSerial, { type: 1, settings: 1, state: 1, serial: 1, fields: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  // type must be table
  if (ds.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, 'unsupportedDataStoreType');

  if (ds.state === DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreNotBuiltYet');

  const record = input.draft
    ? await this.db.collection<TableDataRecord>(`draft_${dsSerial}`).findOne({ serial: recordSerial }, { projection: { _id: 0 } })
    : await this.db.collection<TableDataRecord>(dsSerial).findOne({ serial: recordSerial }, { projection: { _id: 0 } });

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  const update: any = {};
  const inputFieldsNames = Object.keys(input.data);
  const fields = ds.fields.filter(f => !f.system && !f.automated && inputFieldsNames.includes(f.name));

  for (const field of fields) {
    if (field.constant && record[field.name] !== null)
      continue;

    let value = parseValue(input.data[field.name]);

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
        const exists = (await this.db.collection(ds.serial).countDocuments({ [field.name]: value })) > 0;

        if (exists)
          throw new HttpError(HttpCode.CONFLICT, 'valueAlreadyExists', { field: field.name });
      }
    }

    update[field.name] = value;
  }

  const date = new Date();

  update.last_modified = date;

  Object.assign(record, update);

  await this.db.collection(`draft_${ds.serial}`).replaceOne({ serial: recordSerial }, record, { upsert: true });

  this.channel.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'update',
    serial: ds.serial,
    entity: EntityTypes.RECORD,
    payload: { data_store: ds.serial }
  });

  return this.getBySerial<TableDataRecord>(ds.serial, recordSerial, DataRecordState.DRAFT);
}