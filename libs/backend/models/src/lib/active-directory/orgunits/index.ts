import { Orgunit, OrgunitsApi } from '@pestras/shared/data-model';
import { Model } from '../../model';
import { getAll, getBySerial } from './read';
import { exists } from './util';
import { create } from './create';
import { update, updateLogo, updateRegions } from './update';

export class OrgunitsModel extends Model<Orgunit> {

  // Getters
  // ----------------------------------------------------------------------------
  getAll: (projection?: unknown) => Promise<OrgunitsApi.GetAll.Response> = getAll.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<OrgunitsApi.GetBySerial.Response> = getBySerial.bind(this);

  // Util
  // ----------------------------------------------------------------------------
  exists: (serial: string) => Promise<boolean> = exists.bind(this);

  // create
  // ----------------------------------------------------------------------------
  create: (input: OrgunitsApi.Create.Body, issuer: string) => Promise<OrgunitsApi.Create.Response> = create.bind(this);

  // update
  // ----------------------------------------------------------------------------
  update: (serial: string, input: OrgunitsApi.Update.Body, issuer: string) => Promise<Date> = update.bind(this);
  updateLogo: (serial: string, logo: string | null, issuer: string) => Promise<Date> = updateLogo.bind(this);
  updateRegions: (serial: string, regions: string[], issuer: string) => Promise<Date> = updateRegions.bind(this);

  // TODO: delete orgunit
  // ----------------------------------------------------------------------------
}