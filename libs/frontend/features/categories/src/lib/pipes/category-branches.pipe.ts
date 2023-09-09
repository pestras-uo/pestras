import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesState } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util'
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'categoryBranches'
})
export class CategoryBranchesPipe implements PipeTransform {

  constructor(private categoriesState: CategoriesState) { }

  transform(parent: string | null): Observable<Category[]> {
    return parent
      ? this.categoriesState.selectMany(c => Serial.isChild(parent, c.serial))
      : of([]);
  }

}
