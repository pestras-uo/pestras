import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum OrgunitsValidators {
  CREATE = 'createOrgunit',
  UPDATE = 'updateOrgunit'
}

new Validall(OrgunitsValidators.CREATE, {
  name: { $ref: Validators.NAME },
  class: { $type: 'string', $message: 'invalidOrgunitClass' },
  parent: { $default: '', $type: 'string', $message: 'invalidParentSerial' },
  regions: { $default: [], $each: { $type: 'string' } }
});

new Validall(OrgunitsValidators.UPDATE, {
  name: { $ref: Validators.NAME },
  class: { $type: 'string', $message: 'invalidOrgunitClass' },
  regions: { $default: [], $each: { $type: 'string' } }
});