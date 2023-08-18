import { Region, EntityTypes } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { RegionsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateRegionInput = Pick<Region, 'name' | 'type' | 'location' | 'zoom'> & { parent?: string; }

export async function create(this: RegionsModel, data: CreateRegionInput, issuer: string) {

  if (await this.nameExists(data.name))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');
    
  const serial = Serial.gen("RGN", data.parent);

  const date = new Date();
  const region: Region = {
    serial,
    name: data.name,
    type: data.type,
    location: data.location,
    zoom: data.zoom,
    coords: null,
    create_date: date,
    last_modified: date
  };

  await this.col.insertOne(region);

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'create',
    serial,
    entity: EntityTypes.REGION
  }, {});

  return region;
}