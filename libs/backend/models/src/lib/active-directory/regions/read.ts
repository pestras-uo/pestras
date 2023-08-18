/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegionsModel } from ".";

export async function getAll(this: RegionsModel, projection?: any) {
  return await this.col.find({}, { projection })
    .toArray()
}

export async function getBySerial(this: RegionsModel, serial: string, projection?: any) {
  return await this.col.findOne({ serial }, { projection });
}