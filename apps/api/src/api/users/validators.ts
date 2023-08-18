import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum UserValidators {
  CREATE = 'createUser',
  UPDATE_ROLE = 'addUserRoles',
}

new Validall(UserValidators.CREATE, {
  orgunit: { $ref: Validators.SERIAL },
  username: { $ref: Validators.USERNAME },
  password: { $ref: Validators.PASSWORD },
  fullname: { $ref: Validators.FULLNAME },
  mobile: { $type: 'string', $default: '' },
  email: { $type: 'string', $default: '' },
  is_super: { $type: 'boolean', $default: false },
  roles: { $ref: Validators.FULL_ROLES }
});

new Validall(UserValidators.UPDATE_ROLE, {
  is_super: { $type: 'boolean', $default: false },
  roles: { $ref: Validators.FULL_ROLES }
});