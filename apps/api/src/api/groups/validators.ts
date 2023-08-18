import { Validall } from "@pestras/validall";

export enum UsersGroupsValidators {
  CREATE = 'createUsersGroup',
  UPDATE = 'updateUsersGroup'
}

new Validall(UsersGroupsValidators.CREATE, {
  name: { $type: 'string' }
});

new Validall(UsersGroupsValidators.UPDATE, {
  name: { $type: 'string' }
});