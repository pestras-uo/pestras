import { EntityTypes } from "@pestras/shared/data-model";
import { UsersModel } from ".";

export async function addAlternative(
  this: UsersModel,
  user: string,
  alternative: string,
  issuer: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial: user },
    { $addToSet: { alternatives: alternative }, $set: { last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'addAlternative',
    serial: user,
    entity: EntityTypes.USER,
    payload: { alternative }
  });

  return date;
}

export async function removeAlternative(
  this: UsersModel, 
  user: string,
  alternative: string,
  issuer: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial: user },
    { $pull: { alternatives: alternative }, $set: { last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'removeAlternative',
    serial: user,
    entity: EntityTypes.USER,
    payload: { alternative }
  });

  return date;
}