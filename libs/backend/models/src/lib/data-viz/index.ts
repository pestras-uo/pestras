/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "../model";
import { BaseDataViz } from "@pestras/shared/data-model";
import { getBySerial } from './read'; 
import { create } from "./create";
import { update } from "./update";
import { deleteDataViz, deleteManyDataViz } from "./delete";

export { CreateDataVizInput } from './create';
export { UpdateDataVizInput } from './update';

export class DataVizModel extends Model<BaseDataViz<any>> {

  getBySerial = getBySerial.bind(this);

  create = create.bind(this);
  update = update.bind(this);

  delete = deleteDataViz.bind(this);
  deleteManyDataViz = deleteManyDataViz.bind(this);
}