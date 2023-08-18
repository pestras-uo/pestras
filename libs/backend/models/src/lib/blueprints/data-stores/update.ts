import { DataStoreState, EntityTypes, User } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";

export async function update(
  this: DataStoresModel,
  serial: string,
  name: string,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { name, last_modified: date } });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { name }
  }, {
    orgunits: [issuer.orgunit]
  });

  return date
}

export async function updateState(
  this: DataStoresModel,
  serial: string,
  state: Exclude<DataStoreState, DataStoreState.BUILD>,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { state, last_modified: date } });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateState',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { state }
  }, {
    orgunits: [issuer.orgunit]
  });

  return date;
}