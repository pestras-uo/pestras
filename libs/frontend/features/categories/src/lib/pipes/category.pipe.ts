import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesState } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  constructor(private categoriesState: CategoriesState) { }

  transform(serial: string): Category | null {
    return this.categoriesState.get(serial);
  }

}
