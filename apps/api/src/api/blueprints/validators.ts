import { Validall } from "@pestras/validall";

export enum BlueprintsValidators {
  CREATE = 'createBlurprint',
  UPDATE = 'updateBlurprint'
}

new Validall(BlueprintsValidators.CREATE, {
  name: { $type: 'string' }
});

new Validall(BlueprintsValidators.UPDATE, {
  name: { $type: 'string' }
});