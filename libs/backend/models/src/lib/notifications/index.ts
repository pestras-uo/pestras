import { Model } from "../model";
import { Notification } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { changeListener } from "./listener";

export class NotificationsModel extends Model<Notification> {

  constructor(
    db: string, 
    col: string
  ) {
    super(db, col);
  }
  
  protected override onConnect(): void {
    changeListener.call(this);
  }

  // getters
  // --------------------------------------------------------------------------------------
  getAll(user: string) {
    return this.col.find({ user: user, seen: false }).toArray();
  }

  async getBySerial(serial: string) {
    return await this.col.findOne({ serial });
  }

  // create
  // --------------------------------------------------------------------------------------
  async create(notification: Omit<Notification, 'serial'>) {
    const not: Notification = {
      serial: Serial.gen('NTF'),
      ...notification
    }

    await this.col.insertOne(not);

    return not;
  }

  async createMany(notifications: Omit<Notification, 'serial'>[]) {
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
    await this.col.updateOne({ serial }, { $set: { seen: true } });
    return true;
  }
}