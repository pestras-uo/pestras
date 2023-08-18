/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrgunitsModel } from ".";

export async function getAll(this: OrgunitsModel, projection?: any) {
  return await this.col
    .find({}, { projection })
    .toArray();
}

export async function getBySerial(this: OrgunitsModel, serial: string, projection?: any) {
  return await this.col.findOne({ serial }, { projection });
}