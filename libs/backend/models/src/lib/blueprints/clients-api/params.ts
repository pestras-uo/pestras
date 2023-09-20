import { ClientApiDataStoreParam, EntityTypes, Role, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { ClientApiModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type AddClientApiParamInput = Omit<ClientApiDataStoreParam, 'serial'>;

export async function addParam(
  this: ClientApiModel,
  serial: string,
  ds: string,
  options: AddClientApiParamInput,
  issuer: User
) {
  const api = await this.getBySerial(serial, { data_stores: 1 });

  if (!api)
    throw new HttpError(HttpCode.NOT_FOUND, 'clientApiNotFound');

  const dataStore = api.data_stores.find(d => d.serial === ds);

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'clientApiDataStoreOptionsNotFound');

  const paramWithSameAlias = options.alias
    ? dataStore.params.find(p => p.alias === options.alias)
    : dataStore.params.find(p => !p.alias && (p.field === options.field));

  if (paramWithSameAlias)
    throw new HttpError(HttpCode.CONFLICT, 'aliasAlreadyInUse');

  const date = new Date();
  const param: ClientApiDataStoreParam = {
    serial: Serial.gen('PRM'),
    ...options
  };

  await this.col.updateOne({ serial, 'data_stores.serial': ds }, {
    $push: { 'data_stores.$.params': param },
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    method: 'addParam',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { data_store: ds, param }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return { param, date };
}

export type UpdateClientApiParamInput = Omit<ClientApiDataStoreParam, 'serial'>;

export async function updateParam(
  this: ClientApiModel,
  serial: string,
  ds: string,
  param_serial: string,
  options: AddClientApiParamInput,
  issuer: User
) {
  const api = await this.getBySerial(serial, { data_stores: 1 });

  if (!api)
    throw new HttpError(HttpCode.NOT_FOUND, 'clientApiNotFound');

  const dataStore = api.data_stores.find(d => d.serial === ds);

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'clientApiDataStoreOptionsNotFound');

  const paramWithSameAlias = options.alias
    ? dataStore.params.find(p => p.alias === options.alias && p.serial !== param_serial)
    : dataStore.params.find(p => !p.alias && (p.serial !== param_serial) && (p.field === options.field))

  if (paramWithSameAlias)
    throw new HttpError(HttpCode.CONFLICT, 'aliasAlreadyInUse');

  const date = new Date();

  await this.col.updateOne({ serial }, {
    $set: {
      'data_stores.$[data_store].params.$[param].alias': options.alias,
      'data_stores.$[data_store].params.$[param].field': options.field,
      'data_stores.$[data_store].params.$[param].operator': options.operator,
      'data_stores.$[data_store].params.$[param].required': options.required,
      'data_stores.$[data_store].params.$[param].default': options.default,
      last_modified: date
    }
  }, {
    arrayFilters: [{ 'data_store.serial': ds }, { 'param.serial': param_serial }]
  });

  this.channel.emitActivity({
    method: 'updateParam',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { data_store: ds, param: param_serial, change: options }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeParam(
  this: ClientApiModel,
  serial: string,
  ds: string,
  param_serial: string,
  issuer: User
) {
  const api = await this.getBySerial(serial, { data_stores: 1 });

  if (!api)
    throw new HttpError(HttpCode.NOT_FOUND, 'clientApiNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'data_stores.serial': ds }, {
    $pull: { 'data_stores.$.params': { serial: param_serial } },
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    method: 'removeParam',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { data_store: ds, param: param_serial }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}