import { ClientApiDataStore, EntityTypes, Role, User } from "@pestras/shared/data-model";
import { ClientApiModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type AddClientApiDataStoreInput = Pick<ClientApiDataStore, 'max' | 'method' | 'topic'>;

export async function addDataStore(
  this: ClientApiModel,
  serial: string,
  ds: string,
  options: AddClientApiDataStoreInput,
  issuer: User 
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'clientNotFound');

  const date = new Date();
  const dataStore = { ...options, serial: ds, params: [] };

  await this.col.updateOne({ serial }, { 
    $push: { data_stores: dataStore }, 
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    method: 'addDataStore',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { data_store: dataStore }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export type UpdateClientApiDataStoreInput = Pick<ClientApiDataStore, 'max' | 'method' | 'topic'>;

export async function updateDataStore(
  this: ClientApiModel,
  serial: string,
  ds: string,
  options: AddClientApiDataStoreInput,
  issuer: User 
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'clientNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'data_stores.serial': ds }, {
    $set: { 
      'data_stores.$.max': options.max,
      'data_stores.$.method': options.method,
      last_modified: date 
    }
  });

  this.channel.emitActivity({
    method: 'updateDataStore',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { serial: ds, change: options }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeDataStore(
  this: ClientApiModel,
  serial: string,
  ds: string,
  issuer: User 
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'clientNotFound');

  const date = new Date();

  await this.col.updateOne({ serial }, { 
    $oull: { data_stores: { serial: ds } }, 
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    method: 'removeDataStore',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { data_store: ds }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}