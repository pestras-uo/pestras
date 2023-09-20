import {
  DataStoreState,
  DataStoreType,
  EntityTypes,
  Field,
  Role,
  User,
  ValueConstraint,
  createField,
} from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function addField(
  this: DataStoresModel,
  serial: string,
  field: Field,
  issuer: User
) {
  const date = new Date();
  const ds = await this.getBySerial(serial, {
    serial: 1,
    type: 1,
    is_active: 1,
    fields: 1,
    state: 1,
  });

  if (!ds) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!ds.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  if (ds.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, "notAllowedDataStoreType");

  if (ds.fields.some((f) => f.name === field.name))
    throw new HttpError(HttpCode.CONFLICT, "fieldNameAlreadyExists");

  if (ds.fields.some((f) => f.display_name === field.display_name))
    throw new HttpError(HttpCode.CONFLICT, "fieldDisplayNameAlreadyExists");

  const newField = createField(field);

  await this.col.updateOne(
    { serial },
    {
      $push: { fields: newField },
      $set: { last_modified: date },
    }
  );

  // if table already built
  // update current records new field value with default value or null
  if (ds.state !== DataStoreState.BUILD)
    await this.dataDB
      .collection(ds.serial)
      .updateMany({}, { $set: { [field.name]: field.default ?? null } });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addField',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { field: newField },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export type UpdateFieldInput = Pick<Field, "display_name" | "group" | "desc">;

export async function updateField(
  this: DataStoresModel,
  serial: string,
  field: string,
  input: UpdateFieldInput,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { is_active: 1, fields: 1 });

  if (!dataStore) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  const f = dataStore.fields.find((f) => f.name === field);

  if (!f) throw new HttpError(HttpCode.NOT_FOUND, "fieldNotFound");

  if (
    dataStore.fields.some(
      (f) => f.display_name === input.display_name && f.name !== field
    )
  )
    throw new HttpError(HttpCode.CONFLICT, "fieldDisplayNameAlreadyExists");

  Object.assign(f, input);

  await this.col.updateOne(
    { serial, "fields.name": field },
    {
      $set: {
        "fields.$": f,
        last_modified: date,
      },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateField',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { field, change: input },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export type UpdateFieldConfigInput = Omit<
  Field,
  "display_name" | "group" | "desc" | "constraint"
>;

export async function updateFieldConfig(
  this: DataStoresModel,
  serial: string,
  field: string,
  input: UpdateFieldConfigInput,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, {
    is_active: 1,
    fields: 1,
    state: 1,
  });

  if (!dataStore) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  if (dataStore.state !== DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreAlreadyBuilt");

  const f = dataStore.fields.find((f) => f.name === field);

  if (!f) throw new HttpError(HttpCode.NOT_FOUND, "fieldNotFound");

  Object.assign(f, input);

  await this.col.updateOne(
    { serial, "fields.name": field },
    {
      $set: {
        "fields.$": f,
        last_modified: date,
      },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateFieldConfig',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { field, change: input },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function setFieldConstraint(
  this: DataStoresModel,
  serial: string,
  field: string,
  constrinat: ValueConstraint | null,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, {
    type: 1,
    is_active: 1,
    fields: 1,
  });

  if (!dataStore) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  if (dataStore.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, "notAllowedDataStoreType");

  const f = dataStore.fields.find((f) => f.name === field);

  if (!f) throw new HttpError(HttpCode.NOT_FOUND, "fieldNotFound");

  await this.col.updateOne(
    { serial, "fields.name": field },
    {
      $set: {
        "fields.$.constraint": constrinat,
        last_modified: date,
      },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setFieldConstraint',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { field, change: constrinat },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeField(
  this: DataStoresModel,
  serial: string,
  field: string,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, {
    type: 1,
    is_active: 1,
    fields: 1,
    state: 1,
  });

  if (!dataStore) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  if (dataStore.state !== DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreAlreadyBuilt");

  if (dataStore.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, "notAllowedDataStoreType");

  const f = dataStore.fields.find((f) => f.name === field);

  if (!f) return date;

  await this.col.updateOne(
    { serial },
    {
      $pull: { fields: { name: field } },
      $set: { last_modified: date },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeField',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { field },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}
