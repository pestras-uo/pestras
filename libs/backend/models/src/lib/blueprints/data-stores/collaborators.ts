import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function addCollaborator(
  this: DataStoresModel,
  serial: string,
  collaborator: string,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  await this.col.updateOne(
    { serial },
    {
      $addToSet: { collaborators: collaborator },
      $set: { last_modified: date }
    }
  );

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addCollaborator',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { collaborator }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeCollaborator(
  this: DataStoresModel,
  serial: string,
  collaborator: string,
  issuer: User
) {
  const date = new Date();
  const dataStore = await this.getBySerial(serial, { type: 1, is_active: 1 });

  if (!dataStore)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (!dataStore.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreIsInactive');

  await this.col.updateOne(
    { serial },
    {
      $pull: { collaborators: collaborator },
      $set: { last_modified: date }
    }
  );

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeCollaborator',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { collaborator }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}