import { Validall } from "@pestras/validall";

export enum RecordsValidators {
  CREATE = 'createRecord',
  UPDATE = 'updateRecord',
  GET_CATEGORIES = 'getRecordsCategories'
}

new Validall(RecordsValidators.CREATE, {
  $type: 'object', $message: 'invalidRecordInput'
});

new Validall(RecordsValidators.UPDATE, {
  $type: 'object', $message: 'invalidRecordInput'
});

new Validall(RecordsValidators.GET_CATEGORIES, {
  field: { $type: 'string' },
  search: { $type: 'object' }
});