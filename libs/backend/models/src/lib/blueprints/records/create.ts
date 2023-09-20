/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStoreState, DataStoreType, parseValue, validateConstraint, validateValueType, User } from "@pestras/shared/data-model";
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel } from "../../models";

export async function create(
  this: DataRecordsModel,
  dsSerial: string,
  recSerial: string,
  data: any,
  issuer: User
) {
  const ds = await dataStoresModel.getBySerial(dsSerial, { serial: 1, type: 1, fields: 1, state: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');
  
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

  entry.serial = recSerial;
  entry.topic = data.topic ?? null;
  entry.owner = issuer.serial;
  entry.create_date = date;
  entry.last_modified = date;

  await this.db.collection(`draft_${ds.serial}`).insertOne(entry);

  return entry;
}