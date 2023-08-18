import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesState } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';

@Pipe({
  name: 'bpCategories'
})
export class BpCategoriesPipe implements PipeTransform {

  constructor(private categoriesState: CategoriesState) { }

  transform(bp: string, ordinal: boolean | null = null): Category[] {
    return this.categoriesState.getMany(c => c.blueprint === bp && Serial.isRoot(c.serial) && ( ordinal === null ? true : c.ordinal === ordinal));
  }
}
