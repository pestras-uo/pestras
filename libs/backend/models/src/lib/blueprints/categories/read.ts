import { Document } from "mongodb";
import { CategoriesModel } from ".";

export function getByParent(this: CategoriesModel, parent: string) {
  return this.col.find({ serial: { $regex: new RegExp(`_${parent}$`) }}).toArray();
}

export async function getBySerial(this: CategoriesModel, serial: string, projection?: Document) {
  return await this.col.findOne({ serial }, { projection });
}

export async function getByBlueprint(this: CategoriesModel, bp: string, projection?: Document) {
  return await this.col.find({ blueprint: bp }, { projection }).toArray();
}