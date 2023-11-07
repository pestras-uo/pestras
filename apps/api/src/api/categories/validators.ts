import { categoryTypes } from '@pestras/shared/data-model';
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
  type: { $in: categoryTypes },
  value: { $or: [{ $type: 'string' }, { $type: 'number' }, { $tuple: [{ $type: 'number' }, { $type: 'number' }] }] },
  levels: { $type: 'number', $nullable: true },
  parent: { $type: 'string', $nullable: true }
});

new Validall(CategoriesValidators.UPDATE, {
  title: { $type: 'string' },
  type: { $in: categoryTypes },
  value: { $or: [{ $type: 'string' }, { $type: 'number' }, { $tuple: [{ $type: 'number' }, { $type: 'number' }] }] },
});