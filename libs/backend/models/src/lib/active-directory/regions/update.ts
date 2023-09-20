import { EntityTypes, Region, RegionCoords } from "@pestras/shared/data-model";
import { RegionsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type UpdateRegionInput = Pick<Region, 'name' | 'type' | 'location' | 'zoom'>;

export async function update(
  this: RegionsModel,
  serial: string,
  input: UpdateRegionInput,
  issuer: string
) {
  const date = new Date();

  if (await this.nameExists(input.name, serial))
    throw new HttpError(HttpCode.CONFLICT, 'titleAlreadyExists');

  await this.col.updateOne(
    { serial },
    { $set: { ...input, last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.REGION,
    payload: input
  }, {});

  return date;
}


export async function updateCoords(
  this: RegionsModel,
  serial: string,
  input: RegionCoords,
  issuer: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { coords: input, last_modified: date } }
  );

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'updateCoords',
    serial,
    entity: EntityTypes.REGION
  });

  return date;
}