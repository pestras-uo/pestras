import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesState } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util'

@Pipe({
  name: 'categoryBranches'
})
export class CategoryBranchesPipe implements PipeTransform {

  constructor(private categoriesState: CategoriesState) { }

  transform(parent: string | null): Category[] {
    return parent
      ? this.categoriesState.getMany(c => Serial.isChild(parent, c.serial))
      : [];
  }

}
