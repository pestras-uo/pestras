import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { BlueprintsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function update(this: BlueprintsModel, serial: string, name: string, issuer: User) {

  if (await this.nameExists(name, serial))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');

  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { name, last_modified: date } });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.BLUEPRINT,
    payload: { name }
  }, {
    orgunits: [issuer.orgunit] 
  });

  return date;
}

export async function setOwner(
  this: BlueprintsModel,
  serial: string,
  owner: string,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { owner, last_modified: date } });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setOwner',
    serial,
    entity: EntityTypes.BLUEPRINT,
    payload: { owner }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}