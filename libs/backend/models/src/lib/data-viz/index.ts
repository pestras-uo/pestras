/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "../model";
import { BaseDataViz } from "@pestras/shared/data-model";
import { getBySerial } from './read'; 
import { create, CreateDataVizInput } from "./create";
import { update, UpdateDataVizInput } from "./update";
import { deleteDataViz, deleteManyDataViz } from "./delete";

export { CreateDataVizInput, UpdateDataVizInput };

export class DataVizModel extends Model<BaseDataViz<any>> {

  getBySerial: (serial: string) => Promise<BaseDataViz<any> | null> = getBySerial.bind(this);

  create: (input: CreateDataVizInput, issuer: string) => Promise<BaseDataViz<any>> = create.bind(this);
  update: (serial: string, input: UpdateDataVizInput, issuer: string) => Promise<Date> = update.bind(this);

  delete: (serial: string) => Promise<boolean> = deleteDataViz.bind(this);
  deleteManyDataViz: (serials: string[]) => Promise<boolean> = deleteManyDataViz.bind(this);
}