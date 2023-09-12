import { Attachment } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getByEntity, getBySerial } from "./read";
import { create, createMany, CreateAttachmentInput } from "./create";
import { remove, removeByEntity } from "./remove";
import { updateName } from "./update";

export { CreateAttachmentInput };

export class AttachmentsModel extends Model<Attachment> {

  getBySerial: (serial: string) => Promise<Attachment> = getBySerial.bind(this);
  getByEntity: (entity: string) => Promise<Attachment[]> = getByEntity.bind(this);

  create: (input: CreateAttachmentInput) => Promise<Attachment> = create.bind(this);
  createMany: (inputs: CreateAttachmentInput[]) => Promise<boolean> = createMany.bind(this);

  updateName: (serial: string, name: string) => Promise<boolean> = updateName.bind(this);

  remove: (serial: string) => Promise<boolean> = remove.bind(this);
  removeByEntity: (entity: string) => Promise<boolean> = removeByEntity.bind(this);
}