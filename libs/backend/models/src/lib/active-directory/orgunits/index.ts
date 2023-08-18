import { Orgunit } from '@pestras/shared/data-model';
import { Model } from '../../model';
import { getAll, getBySerial } from './read';
import { exists } from './util';
import { create } from './create';
import { update, updateLogo } from './update';

export { CreateOrgunitInput } from './create';
export { UpdateOrgunitInput } from './update';

export class OrgunitsModel extends Model<Orgunit> {

  // Getters
  // ----------------------------------------------------------------------------
  getAll = getAll.bind(this);
  getBySerial = getBySerial.bind(this);

  // Util
  // ----------------------------------------------------------------------------
  exists = exists.bind(this);

  // create
  // ----------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // ----------------------------------------------------------------------------
  update = update.bind(this);
  updateLogo = updateLogo.bind(this);

  // TODO: delete orgunit
  // ----------------------------------------------------------------------------
}