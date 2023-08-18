import { EntityTypes, User } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";

export async function setActivation(
  this: DataStoresModel, 
  serial: string, 
  is_active: boolean,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { is_active, last_modified: date } }
  );

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setActivation',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { is_active }
  }, {
    orgunits: [issuer.orgunit]
  });

  return date;
}