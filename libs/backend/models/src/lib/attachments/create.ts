import { Attachment } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { AttachmentsModel } from ".";

export type CreateAttachmentInput = { entity: string; name: string; path: string; };

export async function create(
  this: AttachmentsModel,
  input: CreateAttachmentInput
) {
  const attachment: Attachment = {
    serial: Serial.gen("ACH"),
    ...input,
    upload_date: new Date()
  }

  await this.col.insertOne(attachment);

  return attachment;
}