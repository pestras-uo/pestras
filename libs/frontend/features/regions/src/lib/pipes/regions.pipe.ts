import { Pipe, PipeTransform } from '@angular/core';
import { RegionsState } from '@pestras/frontend/state';
import { Region } from '@pestras/shared/data-model';
import { Observable } from 'rxjs'

@Pipe({
  name: 'regions'
})
export class RegionsPipe implements PipeTransform {

  constructor(private regionsState: RegionsState) {}

  transform(search: string): Observable<Region[]> {
    return search
      ? this.regionsState.selectMany(r => r.name.includes(search))
      : this.regionsState.data$;
  }

}
