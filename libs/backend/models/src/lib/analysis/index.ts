import { BaseAnalysis } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getBySerial } from './read'; 
import { create, CreateAnalysisInput } from "./create";
import { update, UpdateAnalysisInput } from "./update";
import { deleteAnalysis } from "./delete";

export { CreateAnalysisInput, UpdateAnalysisInput }

export class AnalysisModel extends Model<BaseAnalysis> {

  getBySerial: (serial: string) => Promise<BaseAnalysis> = getBySerial.bind(this);

  create: (input: CreateAnalysisInput, issuer: string) => Promise<BaseAnalysis> = create.bind(this);
  update: (serial: string, input: UpdateAnalysisInput, issuer: string) => Promise<Date> = update.bind(this);

  delete: (serial: string, issuer: string) => Promise<{ serial: string; date: Date; }> = deleteAnalysis.bind(this);
}