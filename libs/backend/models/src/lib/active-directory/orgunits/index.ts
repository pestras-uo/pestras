import { Orgunit } from '@pestras/shared/data-model';
import { Model } from '../../model';
import { getAll, getBySerial } from './read';
import { exists } from './util';
import { create, CreateOrgunitInput } from './create';
import { update, updateLogo, updateRegions, UpdateOrgunitInput } from './update';

export { UpdateOrgunitInput, CreateOrgunitInput };

export class OrgunitsModel extends Model<Orgunit> {

  // Getters
  // ----------------------------------------------------------------------------
  getAll: (projection?: unknown) => Promise<Orgunit[]> = getAll.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<Orgunit | null> = getBySerial.bind(this);

  // Util
  // ----------------------------------------------------------------------------
  exists: (serial: string) => Promise<boolean> = exists.bind(this);

  // create
  // ----------------------------------------------------------------------------
  create: (input: CreateOrgunitInput, issuer: string) => Promise<Orgunit> = create.bind(this);

  // update
  // ----------------------------------------------------------------------------
  update: (serial: string, input: UpdateOrgunitInput, issuer: string) => Promise<Date> = update.bind(this);
  updateLogo: (serial: string, logo: string | null, issuer: string) => Promise<Date> = updateLogo.bind(this);
  updateRegions: (serial: string, regions: string[], issuer: string) => Promise<Date> = updateRegions.bind(this);

  // TODO: delete orgunit
  // ----------------------------------------------------------------------------
}