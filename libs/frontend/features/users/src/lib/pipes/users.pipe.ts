import { Pipe, PipeTransform } from '@angular/core';
import { UsersState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';
import { User } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';

@Pipe({
  name: 'users'
})
export class UsersPipe implements PipeTransform {

  constructor(private state: UsersState) { }

  transform(search: string, orgunit?: string): Observable<User[]> {
    return orgunit
      ? search
        ? this.state.selectMany(u => u.username.includes(search) && Serial.isBranch(u.orgunit, orgunit))
        : this.state.selectMany(u => Serial.isBranch(u.orgunit, orgunit))
      : search
        ? this.state.selectMany(u => u.username.includes(search))
        : this.state.data$;

  }

}
