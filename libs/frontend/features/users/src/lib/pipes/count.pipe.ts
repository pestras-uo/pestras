import { Pipe, PipeTransform } from '@angular/core';
import { UsersState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Pipe({
  name: 'usersCount'
})
export class UsersCountPipe implements PipeTransform {

  constructor(private state: UsersState) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(_: unknown): Observable<number> {
    return this.state.count$;
  }

}
