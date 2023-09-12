import { Region, RegionCoords } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { getAll, getBySerial } from "./read";
import { nameExists } from "./util";
import { create, CreateRegionInput } from "./create";
import { update, updateCoords, UpdateRegionInput } from "./update";

export { CreateRegionInput, UpdateRegionInput }

export class RegionsModel extends Model<Region> {

  // getters
  // -----------------------------------------------------------------------------------
  getAll: (projection?: unknown) => Promise<Region[]> = getAll.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<Region> = getBySerial.bind(this);

  // util
  // ------------------------------------------------------------------------------------
  nameExists: (name: string, exclude?: string) => Promise<boolean> = nameExists.bind(this);

  // create
  // ------------------------------------------------------------------------------------
  create: (data: CreateRegionInput, issuer: string) => Promise<Region> = create.bind(this);

  // update
  // ------------------------------------------------------------------------------------
  update: (serial: string, input: UpdateRegionInput, issuer: string) => Promise<Date> = update.bind(this);
  updateCoords: (serial: string, input: RegionCoords, issuer: string) => Promise<Date> = updateCoords.bind(this);
}