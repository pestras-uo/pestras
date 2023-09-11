import { ApiQuery, WebServiceLog } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { Serial } from "@pestras/shared/util";

export class WebServiceLogModel extends Model<WebServiceLog> {

  search(query: ApiQuery<WebServiceLog>) {
    return this.col.find(query).toArray();
  }

  async insert(service: string, msg: string, type: 'error' | 'info' = 'info') {
    const serial = Serial.gen('WSL');
    
    await this.col.insertOne({ serial, service, type, date: new Date(), msg, sub_logs: [] });

    return serial;
  }

  insertSub(serial: string, msg: string) {
    return this.col.updateOne({ serial }, { $push: { sub_logs: { msg, date: new Date() } } });
  }
}