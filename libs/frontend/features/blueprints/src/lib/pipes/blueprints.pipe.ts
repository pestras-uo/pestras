import { Pipe, PipeTransform } from '@angular/core';
import { Blueprint } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { BlueprintsState } from '@pestras/frontend/state';

@Pipe({
  name: 'blueprints'
})
export class BlueprintsPipe implements PipeTransform {

  constructor(private state: BlueprintsState) {}

  transform(search: string): Observable<Blueprint[]> {
    return search
      ? this.state.selectMany(b => b.name.includes(search))
      : this.state.data$;
  }

}
