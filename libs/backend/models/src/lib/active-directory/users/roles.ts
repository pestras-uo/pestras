import { EntityTypes, User } from "@pestras/shared/data-model";
import { UsersModel } from ".";

export type UpdateUserRolesInput = Pick<User, 'roles' | 'is_super'>;

export async function updateRoles(this: UsersModel, serial: string, input: UpdateUserRolesInput, issuer: string) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { ...input, last_modified: date } }
  );

  this.pubSub.emitActivity({
    issuer,
    create_date: date,
    method: 'updateRoles',
    serial,
    entity: EntityTypes.USER,
    payload: input
  }, {});

  return date;
}