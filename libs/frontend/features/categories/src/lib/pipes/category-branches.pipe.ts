import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesService } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { Observable, map, of } from 'rxjs';

@Pipe({
  name: 'categoryBranches'
})
export class CategoryBranchesPipe implements PipeTransform {

  constructor(private service: CategoriesService) { }

  transform(root: string | null, level: number | null = 1, parent?: string): Observable<Category[]> {
    if (!root)
      return of([]);

    if (level === 1 || !parent)
      return this.service.getByParent({ serial: root, level: level ?? 1 });

    return this.service.getByParent({ serial: root, level: -1 })
      .pipe(map(cats => {
        const parentCat = cats.find(c => c.value === parent && c.level === (level ?? 1) - 1);

        if (!parentCat)
          return [];

        return cats.filter(cat => Serial.isChild(parentCat.serial, cat.serial, 1));
      }));

  }

}
