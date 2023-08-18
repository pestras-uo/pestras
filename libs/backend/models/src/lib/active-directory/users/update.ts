import { EntityTypes } from "@pestras/shared/data-model";
import { UsersModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";


// update username
// ---------------------------------------------------------------------------------
export async function updateUsername(this: UsersModel, serial: string, username: string) {
  if (await this.usernameExists(username))
    throw new HttpError(HttpCode.CONFLICT, 'usernameAlreadyExists');

  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { username, last_modified: date } }
  );

  return date;
}

// update orgunit serial
// ---------------------------------------------------------------------------------
export async function updateOrgunit(this: UsersModel, serial: string, orgunit: string, issuer: string) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { orgunit, last_modified: date } }
  );

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'updateOrgunit',
    serial,
    entity: EntityTypes.USER,
    payload: { orgunit }
  });

  return date;
}