import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState } from '@pestras/frontend/state';
import { Orgunit } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { Serial } from '@pestras/shared/util';

@Pipe({
  name: 'orgunits'
})
export class OrgunitsPipe implements PipeTransform {

  constructor(private state: OrgunitsState) { }

  transform(search: string, parent?: string): Observable<Orgunit[]> {
    return parent
      ? search
        ? this.state.selectMany(org => org.name.includes(search) && Serial.isBranch(org.serial, parent))
        : this.state.selectMany(org => Serial.isBranch(org.serial, parent))
      : search
        ? this.state.selectMany(org => org.name.includes(search))
        : this.state.data$;
  }

}
