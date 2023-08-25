import { Activity } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { Model } from "..//model";

const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export class ActivitiesModel extends Model<Activity> {

  protected override onConnect() {
    this.pubSub.onActivity(activity => {
      this.col.insertOne({ ...activity, serial: Serial.gen('ACT') });
    });
  }

  async getLastWeek(user: string) {
    const day = new Date().getDate();
    const fromDay = new Date().setDate(day - 7)
    const from = new Date(fromDay);

    const activities = await this.col.find({
      issuer: user,
      create_date: { $gte: from }
    }, { projection: { create_date: 1 } }).toArray();

    const days = new Map<number, number>();

    for (const act of activities) {
      const day = new Date(act.create_date).getDay();
      const count = days.get(day) ?? 0;

      days.set(day, count + 1);
    }

    return {
      user: `${user}-week`,
      activities: Array.from(days.entries())
        .map(entry => [weekDays[entry[0]], entry[1]] as [string, number])
    };
  }

  async getLastMonth(user: string) {
    const month = new Date().getMonth();
    const fromMonth = new Date().setMonth(month - 1)
    const from = new Date(fromMonth);

    const activities = await this.col.find({
      issuer: user,
      create_date: { $gte: from }
    }, { projection: { create_date: 1 } }).toArray();

    const days = new Map<string, number>();

    for (const act of activities) {
      const day = new Date(act.create_date).toLocaleDateString();
      const count = days.get(day) ?? 0;

      days.set(day, count + 1);
    }

    return {
      user: `${user}-month`,
      activities: Array.from(days.entries())
    };
  }

  async getLastYear(user: string) {
    const year = new Date().getFullYear();
    const fromYear = new Date().setFullYear(year - 1)
    const from = new Date(fromYear);

    const activities = await this.col.find({
      issuer: user,
      create_date: { $gte: from }
    }, { projection: { create_date: 1 } }).toArray();

    const days = new Map<string, number>();

    for (const act of activities) {
      const year = act.create_date.getFullYear();
      const month = act.create_date.getMonth();
      const key = `${year}-${month}`;
      const count = days.get(key) ?? 0;

      days.set(key, count + 1);
    }

    return {
      user: `${user}-year`,
      activities: Array.from(days.entries())
        .map(entry => [months[+entry[0].split('-')[1]], entry[1]] as [string, number])
    }
  }
}