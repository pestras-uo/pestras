import { Pipe, PipeTransform } from '@angular/core';
import { Blueprint } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { BlueprintsState } from '@pestras/frontend/state';

@Pipe({
  name: 'blueprint'
})
export class BlueprintPipe implements PipeTransform {

  constructor(private state: BlueprintsState) {}

  transform(serial: string): Observable<Blueprint | null> {
    return this.state.select(serial);
  }

}
