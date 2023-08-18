/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientApiModel } from ".";

export async function getByBlueprint(this: ClientApiModel, blueprint: string, projection?: any) {
  return this.col.find({ blueprint }, { projection }).toArray();
}

export async function getBySerial(
  this: ClientApiModel,
  serial: string,
  projection?: any
) {
  return this.col.findOne({ serial }, { projection });
}

export async function exists(this: ClientApiModel, serial: string) {
  return (await this.col.countDocuments({ serial })) > 0;
}

export async function nameExists(this: ClientApiModel, name: string, exclude?: string) {
  return exclude
    ? (await this.col.countDocuments({ client_name: name, serial: { $ne: exclude } })) > 0
    : (await this.col.countDocuments({ client_name: name })) > 0;
}