/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role, User, UserState } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { UsersModel } from ".";

export async function getAll(this: UsersModel, projection?: any) {
  return await this.col.find({ state: UserState.ACTIVE }, { projection }).toArray();
}

export async function count(this: UsersModel) {
  return await this.col.countDocuments({ state: UserState.ACTIVE });
}

export async function getBySerial(this: UsersModel, serial: string, projection?: any) {
  return await this.col.findOne({ serial }, { projection });
}

export async function getByUsername(this: UsersModel, username: string, projection?: any) {
  return await this.col.findOne({ username }, { projection });
}

export async function electAdmin(
  this: UsersModel,
  orgunit: string,
  projection?: any,
  preferable?: string
) {
  const tree = Serial.toTree(orgunit);
  const query: any = { $or: [], role: Role.ADMIN, state: UserState.ACTIVE };

  for (const serial of tree)
    query.$or.push({ serial });

  const users = await this.col.find(query, { projection }).toArray();

  if (users.length === 0)
    return null;

  return users
    .reduce((selected: User | null, curr) => {
      return !selected || (preferable && preferable === curr.serial)
        ? curr
        : Serial.countLevels(selected.orgunit) > Serial.countLevels(curr.orgunit)
          ? selected : curr;
    }, null);
}