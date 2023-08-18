import { AttachmentsModel } from ".";

export async function updateName(
  this: AttachmentsModel,
  serial: string,
  name: string
) {
  await this.col.updateOne({ serial }, { $set: { name }});

  return true;
}