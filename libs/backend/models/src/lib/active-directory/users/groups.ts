import { EntityTypes, Role } from "@pestras/shared/data-model";
import { UsersModel } from ".";

export async function addGroup(
  this: UsersModel,
  user: string,
  group: string,
  issuer: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial: user },
    { $addToSet: { groups: group }, $set: { last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'addGroup',
    serial: user,
    entity: EntityTypes.USER,
    payload: { group }
  }, {
    roles: [Role.ADMIN]
  });

  return date;
}

export async function removeGroup(
  this: UsersModel, 
  user: string,
  group: string,
  issuer: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial: user },
    { $pull: { groups: group }, $set: { last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'removeGroup',
    serial: user,
    entity: EntityTypes.USER,
    payload: { group }
  }, {
    roles: [Role.ADMIN]
  });

  return date;
}