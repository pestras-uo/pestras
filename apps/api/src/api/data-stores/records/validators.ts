import { Validall } from "@pestras/validall";

export enum RecordsValidators {
  CREATE = 'createRecord',
  UPDATE = 'updateRecord'
}

new Validall(RecordsValidators.CREATE, {
  $type: 'object', $message: 'invalidRecordInput'
});

new Validall(RecordsValidators.UPDATE, {
  $type: 'object', $message: 'invalidRecordInput'
});