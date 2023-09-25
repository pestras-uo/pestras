/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStoresModel } from ".";

export function getByBlueprint(this:DataStoresModel, bp: string) {
  return this.col.find({ blueprint: bp }).toArray();
}

export function getBySerial(
  this: DataStoresModel,
  serial: string,
  projection?: any
) {
  return this.col.findOne({ serial }, { projection });
}

export async function exists(this: DataStoresModel, serial: string) {
  return (await this.col.countDocuments({ serial })) > 0;
}

export async function getFields(
  this: DataStoresModel,
  serial: string
) {
  const ds = await this.getBySerial(serial, { fields: 1 });

  if (!ds)
    return [];

  return ds.fields;
}

export function search(this: DataStoresModel, query: any, skip = 0, limit = 0, projection: any) {
  return this.col.find(query, { projection, skip, limit }).toArray();
}