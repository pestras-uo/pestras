import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum SessionValidators {
  LOGIN = 'login'
}

new Validall(SessionValidators.LOGIN, {
  username: { $ref: Validators.USERNAME },
  password: { $ref: Validators.PASSWORD },
  remember: { $type: 'boolean', $default: false }
});