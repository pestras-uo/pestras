import { Serial } from '@pestras/shared/util';
import { CategoriesModel } from ".";

export async function titleExists(this: CategoriesModel, title: string, serial?: string) {
  const parent = Serial.getParent(serial ?? '');

  if (parent && serial) {
    return (await this.col.countDocuments({
      title,
      $and: [
        { serial: { $nin: [serial] } },
        { serial: { $regex: new RegExp(`_${parent}$`) } }
      ]
    })) > 0;
  }

  if (parent) {
    return (await this.col.countDocuments({
      title,
      serial: { $regex: new RegExp(`_${parent}$`) }
    })) > 0;
  }

  if (serial)
    return (await this.col.countDocuments({
      title,
      serial: { $nin: [serial] }
    })) > 0;

  return (await this.col.countDocuments({ title })) > 0;
}