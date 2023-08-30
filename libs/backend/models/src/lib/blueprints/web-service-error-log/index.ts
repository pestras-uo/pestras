import { WebServiceErrorLog } from "@pestras/shared/data-model";
import { Model } from "../../model";

export class WebServiceErrorLogModel extends Model<WebServiceErrorLog> {

  insert(service: string, error: string) {
    return this.col.insertOne({ service, error, date: new Date() });
  }
}