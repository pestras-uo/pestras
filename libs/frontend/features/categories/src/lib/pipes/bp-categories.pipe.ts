import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesService } from '@pestras/frontend/state';
import { Category, CategoryType } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'bpCategories'
})
export class BpCategoriesPipe implements PipeTransform {

  constructor(private service: CategoriesService) { }

  transform(bp: string, type: CategoryType = 'nominal'): Observable<Category[]> {
    return this.service.getByBlueprint({ blueprint: bp })
      .pipe(map(list => list.filter(c => Serial.isRoot(c.serial) && c.type === type)));
  }
}
