import { Attachment } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { AttachmentsModel } from ".";

export type CreateAttachmentInput = Pick<Attachment, 'entity' | 'parent' | 'name' | 'path'>;

export async function create(
  this: AttachmentsModel,
  input: CreateAttachmentInput
) {
  const attachment: Attachment = {
    ...input,
    serial: Serial.gen("ACH"),
    upload_date: new Date()
  }

  await this.col.insertOne(attachment);

  return attachment;
}

export async function createMany(
  this: AttachmentsModel,
  inputs: CreateAttachmentInput[]
) {
  const attachments: Attachment[] = inputs.map(i => ({
    ...i,
    serial: Serial.gen("ACH"),
    upload_date: new Date()
  }))

  await this.col.insertMany(attachments);

  return true;
}