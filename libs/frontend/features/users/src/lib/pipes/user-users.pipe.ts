import { Pipe, PipeTransform } from '@angular/core';
import { UsersState, SessionState } from '@pestras/frontend/state';
import { Observable, switchMap, of, map } from 'rxjs';
import { Role, User } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';

@Pipe({
  name: 'userUsers'
})
export class UserUsersPipe implements PipeTransform {

  constructor(
    private state: UsersState,
    private session: SessionState
  ) { }

  transform(search: string, serial?: string): Observable<User[]> {
    const user = serial
      ? this.state.select(serial)
      : this.session.data$;

    return user.pipe(
      switchMap(user => {
        if (!user)
          return of([]);

        if (user.orgunit === "*")
          return this.state.data$;

        if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.DATA_ENG) || user.roles.includes(Role.REPORTER))
          return this.state.selectMany(u => Serial.isBranch(u.orgunit, user.orgunit, true));

        return of([user]);
      }),
      map(list => search ? list.filter(u => u.username.includes(search) || u.fullname.includes(search)) : list)
    );
  }

}
