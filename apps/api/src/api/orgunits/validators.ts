import { Validall } from '@pestras/validall';
import { Validators } from '../../validators';

export enum OrgunitsValidators {
  CREATE = 'createOrgunit',
  UPDATE = 'updateOrgunit',
  UPDATE_REGIONS = 'updateOrgunitsRegions'
}

new Validall(OrgunitsValidators.CREATE, {
  name: { $type: 'string' },
  is_partner: { $type: 'boolean' },
  class: { $type: 'string', $message: 'invalidOrgunitClass' },
  parent: { $default: '', $type: 'string', $message: 'invalidParentSerial' },
  regions: { $default: [], $each: { $type: 'string' } }
});

new Validall(OrgunitsValidators.UPDATE, {
  name: { $ref: Validators.NAME },
  class: { $type: 'string', $message: 'invalidOrgunitClass' }
});

new Validall(OrgunitsValidators.UPDATE_REGIONS, {
  regions: { $default: [], $each: { $type: 'string' } }
});