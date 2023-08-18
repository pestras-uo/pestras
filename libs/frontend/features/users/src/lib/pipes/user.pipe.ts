import { Pipe, PipeTransform } from '@angular/core';
import { UsersState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';
import { User } from '@pestras/shared/data-model';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(private state: UsersState) {}

  transform(serial: string): Observable<User | null> {
    return this.state.select(serial);
  }

}
