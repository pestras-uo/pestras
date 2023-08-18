import { Activity } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { Model } from "..//model";

export class ActivitiesModel extends Model<Activity> {

  protected override onConnect() {
    this.pubSub.onActivity(activity => {
      this.col.insertOne({ ...activity, serial: Serial.gen('ACT') });
    });
  }

  getUserActivity(user: string, from: Date, to: Date) {
    return this.col.find({
      issuer: user,
      $and: [
        { create_date: { $gte: from } },
        { create_date: { $lte: to } }
      ]
    }).toArray();
  }
}