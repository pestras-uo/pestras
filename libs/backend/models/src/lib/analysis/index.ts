import { BaseAnalysis } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getBySerial } from './read'; 
import { create } from "./create";
import { update } from "./update";
import { deleteAnalysis } from "./delete";

export { CreateAnalysisInput } from './create';
export { UpdateAnalysisInput } from './update';

export class AnalysisModel extends Model<BaseAnalysis> {

  getBySerial = getBySerial.bind(this);

  create = create.bind(this);
  update = update.bind(this);

  delete = deleteAnalysis.bind(this);
}