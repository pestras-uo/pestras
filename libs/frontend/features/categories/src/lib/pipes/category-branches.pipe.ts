import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesService } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'categoryBranches'
})
export class CategoryBranchesPipe implements PipeTransform {

  constructor(private service: CategoriesService) { }

  transform(parent: string | null): Observable<Category[]> {
    return parent
      ? this.service.getByParent({serial: parent })
      : of([]);
  }

}
