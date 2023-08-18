import { Document } from "mongodb";
import { CategoriesModel } from ".";

export function getAll(this: CategoriesModel, projection?: Document) {
  return this.col.find({}, { projection }).toArray();
}

export async function getBySerial(this: CategoriesModel, serial: string, projection ?: Document) {
  return await this.col.findOne({ serial }, { projection });
}