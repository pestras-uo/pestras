import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesService } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  constructor(private service: CategoriesService) { }

  transform(serial: string): Observable<Category | null> {
    return this.service.getBySerial({ serial });
  }
}
