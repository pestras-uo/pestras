import { Validall } from "@pestras/validall";

export enum RecordsValidators {
  CREATE = 'createRecord',
  UPDATE = 'updateRecord'
}

new Validall(RecordsValidators.CREATE, {
  $required: true, $type: 'object', $message: 'invalidRecordInput'
});

new Validall(RecordsValidators.UPDATE, {
  $required: true, $type: 'object', $message: 'invalidRecordInput'
});