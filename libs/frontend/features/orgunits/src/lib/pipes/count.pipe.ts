import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Pipe({
  name: 'orgunitsCount'
})
export class OrgunitCountPipe implements PipeTransform {

  constructor(private state: OrgunitsState) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(_: unknown): Observable<number> {
    return this.state.count$;
  }

}
