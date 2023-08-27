import { Pipe, PipeTransform } from '@angular/core';
import { RegionsState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Pipe({
  name: 'regionsCount'
})
export class RegionsCountPipe implements PipeTransform {

  constructor(private regionsState: RegionsState) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(_: unknown): Observable<number> {
    return this.regionsState.count$;
  }

}
