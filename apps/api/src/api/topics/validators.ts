import { Validall } from "@pestras/validall";

export enum TopicsValidators {
  CREATE = 'createTopic',
  UPDATE = 'updateTopic'
}

new Validall(TopicsValidators.CREATE, {
  blueprint: { $type: 'string' },
  parent: { $type: 'string', $nullable: true },
  name: { $type: 'string' }
});

new Validall(TopicsValidators.UPDATE, {
  name: { $type: 'string' }
});