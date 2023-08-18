import { EntityTypes, Orgunit } from "@pestras/shared/data-model";
import { OrgunitsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type UpdateOrgunitInput = Pick<Orgunit, 'name' | 'class' | 'regions'>;

export async function update(this: OrgunitsModel, serial: string, input: UpdateOrgunitInput, issuer: string) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { name: input.name, class: input.class, regions: input.regions, last_modified: date } }
  );

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    serial,
    entity: EntityTypes.ORGUNIT,
    method: 'update',
    payload: input
  }, {});

  return date;
}

export async function updateLogo(
  this: OrgunitsModel, 
  serial: string, 
  logo: string | null,
  issuer: string
) {
  const orgunit = await this.getBySerial(serial, { logo: 1 });

  if (!orgunit)
    throw new HttpError(HttpCode.NOT_FOUND, "orgunitNotFound");

  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { logo, last_modified: date } }
  );

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'updateLogo',
    serial,
    entity: EntityTypes.ORGUNIT,
    payload: { logo }
  });

  return date;
}