import { WebServiceLog } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { Serial } from "@pestras/shared/util";

export class WebServiceLogModel extends Model<WebServiceLog> {

  async insert(service: string, msg: string) {
    const serial = Serial.gen('WSL');
    
    await this.col.insertOne({ serial, service, date: new Date(), msg, sub_logs: [] });

    return serial;
  }

  insertSub(serial: string, msg: string) {
    return this.col.updateOne({ serial }, { $push: { sub_logs: { msg, date: new Date() } } });
  }
}