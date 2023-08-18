import { Validall } from "@pestras/validall";

export enum attachmentsValidators {
  CREATE = 'createAttachment',
  UPDATE_NAME = 'updateAttachmentName'
}

new Validall(attachmentsValidators.CREATE, {
  entity: { $type: 'string' },
  name: { $type: 'string' }
});

new Validall(attachmentsValidators.UPDATE_NAME, {
  name: { $type: 'string' }
});