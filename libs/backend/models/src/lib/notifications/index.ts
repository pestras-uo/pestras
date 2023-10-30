/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "../model";
import { Notification } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';

export class NotificationsModel extends Model<any> {

  constructor(
    db: string, 
    col: string
  ) {
    super(db, col);
  }
  
  protected override onConnect(): void {
    // changeListener.call(this);
  }

  // getters
  // --------------------------------------------------------------------------------------
  getAll(user: string) {
    return this.col.find({ target: user, seen: null }).toArray();
  }

  async getBySerial(serial: string) {
    return await this.col.findOne({ serial });
  }

  // create
  // --------------------------------------------------------------------------------------
  async notify<T extends Notification>(notification: Omit<T, 'serial'>) {
    const not: Notification = {
      serial: Serial.gen('NTF'),
      ...notification
    }

    await this.col.insertOne(not);

    return not;
  }

  async notifyMany<T extends Notification>(notifications: Omit<T, 'serial'>[]) {
    const list: Notification[] = []

    for (const notification of notifications)
      list.push({ serial: Serial.gen('NTF'), ...notification });

    if (list.length > 0)
      await this.col.insertMany(list);

    return list;
  }

  // update seen
  // --------------------------------------------------------------------------------------
  async setSeen(serial: string) {
    const date = new Date();
    await this.col.updateOne({ serial }, { $set: { seen: date } });
    return date;
  }
}