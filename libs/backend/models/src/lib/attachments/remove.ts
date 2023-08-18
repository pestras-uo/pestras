import { AttachmentsModel } from ".";

export async function remove(
  this: AttachmentsModel,
  serial: string
) {
  await this.col.deleteOne({ serial });

  return true;
}

export async function removeByEntity(
  this: AttachmentsModel,
  entity: string
) {
  await this.col.deleteMany({ entity });

  return true;
}