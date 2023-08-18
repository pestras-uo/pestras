import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState } from '@pestras/frontend/state';
import { Orgunit } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'orgunit'
})
export class OrgunitPipe implements PipeTransform {

  constructor(private state: OrgunitsState) { }

  transform(serial: string): Observable<Orgunit | null> {
    return this.state.select(serial);
  }

}
