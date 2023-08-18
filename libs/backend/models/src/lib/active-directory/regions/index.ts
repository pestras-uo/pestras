import { Region } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { getAll, getBySerial } from "./read";
import { nameExists } from "./util";
import { create } from "./create";
import { update, updateCoords } from "./update";

export { CreateRegionInput } from './create';
export { UpdateRegionInput } from './update';

export class RegionsModel extends Model<Region> {

  // getters
  // -----------------------------------------------------------------------------------
  getAll = getAll.bind(this);
  getBySerial = getBySerial.bind(this);

  // util
  // ------------------------------------------------------------------------------------
  nameExists = nameExists.bind(this);

  // create
  // ------------------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // ------------------------------------------------------------------------------------
  update = update.bind(this);
  updateCoords = updateCoords.bind(this);
}