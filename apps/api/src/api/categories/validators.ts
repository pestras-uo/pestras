import { Validall } from '@pestras/validall';

export enum CategoriesValidators {
  CREATE = 'createCategory',
  UPDATE = 'updateCategory',
  ADD_BRANCH = 'addCategoryBranch',
  UPDATE_BRANCH = 'updateCategoryBranch',
}

new Validall(CategoriesValidators.CREATE, {
  blueprint: { $type: 'string' },
  title: { $type: 'string' },
  ordinal: { $cast: 'boolean' },
  value: { $or: [{ $type: 'string' }, { $type: 'number' }] },
  parent: { $type: 'string', $nullable: true } 
});

new Validall(CategoriesValidators.UPDATE, {
  title: { $type: 'string' },
  ordinal: { $cast: 'boolean' },
  value: { $or: [{ $type: 'string' }, { $type: 'number' }] },
});