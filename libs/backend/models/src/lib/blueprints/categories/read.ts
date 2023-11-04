/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoriesModel } from ".";

export function getByParent(this: CategoriesModel, parent: string, level = 1) {
  return level === -1
    ? this.col.find({ serial: { $regex: new RegExp(`_${parent}$`) } }).toArray()
    : this.col.find({ serial: { $regex: new RegExp(`_${parent}$`) }, level }).toArray();
}

export async function getBySerial(this: CategoriesModel, serial: string, projection?: Record<string, any>) {
  return await this.col.findOne({ serial }, { projection });
}

export async function getByBlueprint(this: CategoriesModel, bp: string, projection?: Record<string, any>) {
  return await this.col.find({ blueprint: bp }, { projection }).toArray();
}

export async function getByValue(this: CategoriesModel, parent: string, value: number) {
  return this.col.findOne({ serial: { $regex: new RegExp(`_${parent}$`) }, value });
}