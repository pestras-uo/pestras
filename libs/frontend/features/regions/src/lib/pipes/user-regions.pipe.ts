import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState, RegionsState, SessionState, UsersState } from '@pestras/frontend/state';
import { of, switchMap, Observable, map } from 'rxjs';
import { Region } from '@pestras/shared/data-model';

@Pipe({
  name: 'userRegions'
})
export class UserRegionsPipe implements PipeTransform {

  constructor(
    private session: SessionState,
    private usersState: UsersState,
    private orgsState: OrgunitsState,
    private regionsState: RegionsState
  ) { }

  transform(search: string | null, user?: string): Observable<Region[]> {
    return (
      user
        ? this.usersState.select(user)
        : this.session.data$
    )
      .pipe(
        switchMap(usr => this.orgsState.select(usr?.orgunit ?? '')),
        switchMap(org => {
          if (!org)
            return of([])

          return org?.regions.length
            ? this.regionsState.selectMany(org.regions)
            : this.regionsState.data$;
        }),
        map(list => search ? list.filter(r => r.name.includes(search)) : list)
      );
  }

}
