import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { ClientApiModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function addIP(
  this: ClientApiModel,
  serial: string,
  ip: string,
  issuer: User 
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'clientNotFound');

  const date = new Date();

  await this.col.updateOne({ serial }, { 
    $addToSet: { ips: ip }, 
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    method: 'addIP',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: [ ip ]
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeIP(
  this: ClientApiModel,
  serial: string,
  ip: string,
  issuer: User 
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'clientNotFound');

  const date = new Date();

  await this.col.updateOne({ serial }, { 
    $pull: { ips: ip }, 
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    method: 'removeIP',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { ip }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}