import { AttachmentsModel } from ".";

export async function getBySerial(
  this: AttachmentsModel,
  serial: string
) {
  return this.col.findOne({ serial });
}

export async function getByEntity(
  this: AttachmentsModel,
  entity: string
) {
  return this.col.find({ entity }).toArray();
}