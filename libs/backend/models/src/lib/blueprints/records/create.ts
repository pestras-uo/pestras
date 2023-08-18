/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore, DataStoreState, DataStoreType, EntityTypes, parseValue, validateConstraint, validateValueType, WorkflowState, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function create(
  this: DataRecordsModel,
  ds: DataStore,
  data: any,
  issuer: User
) {
  // type must be table
  if (ds.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, 'unsupportedDataStoreType');

  if (ds.state === DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreNotBuiltYet');

  const entry: any = {};
  const fieldsToInsert = ds.fields.filter(f => !f.system && (f.required || f.initial));

  for (const field of fieldsToInsert) {
    if (field.automated) {
      entry[field.name] = field.default ?? null;
      continue;
    }

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
        const exists = (await this.db.collection(ds.serial).countDocuments({ [field.name]: value })) > 0;

        if (exists)
          throw new HttpError(HttpCode.CONFLICT, 'valueAlreadyExists', { field: field.name });
      }
    }

    entry[field.name] = value;
  }

  // add system fields
  const date = new Date();
  entry.serial = Serial.gen('RCD');
  entry.topic = data.topic ?? null;
  entry.workflow = WorkflowState.DRAFT;
  entry.owner = issuer.serial;
  entry.create_date = date;
  entry.last_modified = date;

  await this.db.collection(ds.serial).insertOne(entry);

  // if (ds.settings.workflow)
  //   await recordsWorkflowModel.create(ds.serial, entry.serial);

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'create',
    serial: entry.serial,
    entity: EntityTypes.RECORD,
    payload: { data_store: ds.serial }
  });

  return entry;
}