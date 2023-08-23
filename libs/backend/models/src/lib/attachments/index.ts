import { Attachment } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getByEntity, getBySerial } from "./read";
import { create } from "./create";
import { remove, removeByEntity } from "./remove";
import { updateName } from "./update";

export { CreateAttachmentInput } from './create';

export class AttachmentsModel extends Model<Attachment> {

  getBySerial = getBySerial.bind(this);
  getByEntity = getByEntity.bind(this);

  create = create.bind(this);

  updateName = updateName.bind(this);

  remove = remove.bind(this);
  removeByEntity = removeByEntity.bind(this);
}