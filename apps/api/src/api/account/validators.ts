import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum AccountValidators {
  UPDATE_USERNAME = 'updateUsername',
  UPDATE_PASSWORD = 'updatePassword',
  UPDATE_PROFILE = 'updateProfile'
}

new Validall(AccountValidators.UPDATE_USERNAME, {
  username: { $ref: Validators.USERNAME }
});

new Validall(AccountValidators.UPDATE_PASSWORD, {
  currentPassword: { $type: 'string', $message: 'invalidCurrentPassword' },
  newPassword: { $ref: Validators.PASSWORD }
});

new Validall(AccountValidators.UPDATE_PROFILE, {
  fullname: { $ref: Validators.FULLNAME },
  mobile: { $type: "string", $default: "" },
  email: { $type: "string", $default: "" }
});