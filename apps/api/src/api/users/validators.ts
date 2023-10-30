import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum UserValidators {
  CREATE = 'createUser',
  UPDATE_USERNAME = 'updateUserUsername',
  UPDATE_ROLE = 'addUserRoles',
  UPDATE_PASSWORD = 'updatePassword',
  UPDATE_PROFILE = 'updateProfile'
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

new Validall(UserValidators.UPDATE_USERNAME, {
  username: { $type: 'string' }
});

new Validall(UserValidators.UPDATE_PROFILE, {
  fullname: { $ref: Validators.FULLNAME },
  mobile: { $type: "string", $default: "" },
  email: { $type: "string", $default: "" }
});

new Validall(UserValidators.UPDATE_PASSWORD, {
  password: { $ref: Validators.PASSWORD }
});