/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStoreType, EntityTypes, Interval, Role, User, WSAccept, WSAuth, WSContentType, WSQueryOptions, WebServiceConfig, WebServiceSelection, getFieldsFromSelections } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";


// Main Settings
// --------------------------------------------------------------------------------------
export type SetWebServiceConfigInput = Omit<
  WebServiceConfig,
  | 'auth'
  | 'headers'
  | 'initialized'
  | 'payload'
  | 'selection'
>;

export async function setWebServiceConfig(
  this: DataStoresModel,
  serial: string,
  input: SetWebServiceConfigInput,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  const ws: WebServiceConfig = Object.assign(dataStore.web_service || {
    resource_uri: 'http://localhost:8080',
    method: 'get',
    make_init_request: false,
    content_type: WSContentType.JSON,
    accept: WSAccept.JSON,
    data_path: '.',
    replace_existing: true,
    intervals: Interval.NONE,
    fetch_day: 1,
    auth: null,
    headers: [],
    payload: [],
    selection: [],
    initialized: false
  }, input);

  await this.col.updateOne(
    { serial },
    { $set: { web_service: ws, last_modified: date } }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setWebServiceConfig',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { web_service: ws }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}



// Auth Settings
// --------------------------------------------------------------------------------------
export async function setWebServiceAuth(
  this: DataStoresModel,
  serial: string,
  auth: WSAuth | null,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceConfigNotAvailableYet');

  if (auth)
    auth.password = Buffer.from(auth.password).toString('base64');

  await this.col.updateOne({ serial }, { $set: { 'web_service.auth': auth, last_modified: date } });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setWebServiceAuth',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { auth }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}




// Header Settings
// --------------------------------------------------------------------------------------
export async function setHeader(
  this: DataStoresModel,
  serial: string,
  header: { key: string; value?: string | null; },
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceSettingNotAvailableYet');

  if (!header.value)
    await this.col.updateOne(
      { serial },
      {
        $pull: { "web_service.headers": { key: header.key } },
        $set: { last_modified: date }
      }
    );

  else if (dataStore.web_service.headers.find((h: any) => h.key === header.key))
    await this.col.updateOne(
      { serial, "web_service.headers.key": header.key },
      { $set: { "web_service.headers.$.value": header.value, last_modified: date } }
    );

  else
    await this.col.updateOne(
      { serial },
      {
        $push: { 'web_service.headers': header },
        $set: { last_modified: date }
      }
    );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setHeader',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { header }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}




// Query Settings
// --------------------------------------------------------------------------------------
export async function addQueryOption(
  this: DataStoresModel,
  serial: string,
  options: WSQueryOptions,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceConfigNotAvailableYet');

  const opt: WSQueryOptions = {
    ...options,
    serial: Serial.gen('QRY')
  };

  await this.col.updateOne(
    { serial },
    {
      $push: { 'web_service.payload': opt },
      $set: { last_modified: date }
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addQueryOption',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { param: opt }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return { option: opt, date };
}


export async function removeQueryOption(
  this: DataStoresModel,
  serial: string,
  option: string,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceConfigNotAvailableYet');

  await this.col.updateOne(
    { serial },
    {
      $pull: { 'web_service.payload': { serial: option } },
      $set: { last_modified: date }
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeQueryOption',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { param: option }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}




// Cleansing settings
// --------------------------------------------------------------------------------------
export async function addSelection(
  this: DataStoresModel,
  serial: string,
  input: WebServiceSelection,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceConfigNotAvailableYet');

  const selections: WebServiceSelection[] = dataStore.web_service.selection;

  selections.push(input);

  const fields = getFieldsFromSelections(selections);

  await this.col.updateOne(
    { serial },
    {
      $push: { 'web_service.selection': input },
      $set: { fields, last_nodified: date } as any
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addSelection',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: null
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return (await this.getBySerial(serial));
}


export async function removeSelection(
  this: DataStoresModel,
  serial: string,
  field: string,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1, web_service: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  if (dataStore.type !== DataStoreType.WEB_SERVICE)
    throw new HttpError(HttpCode.FORBIDDEN, 'notAllowedDataStoreType');

  if (!dataStore.web_service)
    throw new HttpError(HttpCode.FORBIDDEN, 'WebServiceConfigNotAvailableYet');

  const selection: WebServiceSelection[] = dataStore.web_service.selection.filter((s: WebServiceSelection) => s.field !== field);

  const fields = getFieldsFromSelections(selection);

  await this.col.updateOne(
    { serial },
    {
      $set: { 'settings.selection': selection, fields, last_nodified: date } as any
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeSelection',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: null
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return (await this.getBySerial(serial));
}