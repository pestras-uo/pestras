import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { BlueprintsState } from '@pestras/frontend/state';

@Pipe({
  name: 'blueprintsCount'
})
export class BlueprintsCountPipe implements PipeTransform {

  constructor(private state: BlueprintsState) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(_: unknown): Observable<number> {
    return this.state.count$;
  }

}
