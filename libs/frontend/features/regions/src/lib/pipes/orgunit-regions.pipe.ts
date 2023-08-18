import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState, RegionsState } from '@pestras/frontend/state';
import { of, switchMap, Observable } from 'rxjs';
import { Region } from '@pestras/shared/data-model';

@Pipe({
  name: 'orgunitRegions'
})
export class OrgunitRegionsPipe implements PipeTransform {

  constructor(
    private orgsState: OrgunitsState,
    private regionsState: RegionsState
  ) { }

  transform(serial: string): Observable<Region[]> {
    return this.orgsState.select(serial)
      .pipe(switchMap(org => {
        if (!org)
          return of([])

        return org?.regions.length
          ? this.regionsState.selectMany(org.regions)
          : this.regionsState.data$;
      }));
  }

}
