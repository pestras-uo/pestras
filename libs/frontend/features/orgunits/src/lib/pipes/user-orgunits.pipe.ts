import { Pipe, PipeTransform } from '@angular/core';
import { OrgunitsState, SessionState, UsersState } from '@pestras/frontend/state';
import { Orgunit, Role } from '@pestras/shared/data-model';
import { Observable, map, of, switchMap } from 'rxjs';
import { Serial } from '@pestras/shared/util'

@Pipe({
  name: 'userOrgunits'
})
export class UserOrgunitsPipe implements PipeTransform {

  constructor(
    private state: OrgunitsState,
    private session: SessionState,
    private usersState: UsersState
  ) { }

  transform(search: string, serial?: string): Observable<Orgunit[]> {
    const user = serial
      ? this.usersState.select(serial)
      : this.session.data$;

    return user.pipe(
      switchMap(user => {
        if (!user)
          return of([]);

        if (user.orgunit === '*')
          return this.state.data$;

        if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.DATA_ENG) || user.roles.includes(Role.REPORTER))
          return this.state.selectMany(org => Serial.isBranch(org.serial, user.orgunit, true));

        return this.state.selectMany([user.orgunit]);
      }),
      map(list => search ? list.filter(org => org.name.includes(search)) : list)
    );
  }

}
