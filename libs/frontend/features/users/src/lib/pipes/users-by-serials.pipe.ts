import { Pipe, PipeTransform } from '@angular/core';
import { UsersState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';
import { User } from '@pestras/shared/data-model';

@Pipe({
  name: 'usersBySerials'
})
export class UsersBySerialsPipe implements PipeTransform {

  constructor(private state: UsersState) { }

  transform(serials: string[]): Observable<User[]> {
    return this.state.selectMany(serials);
  }

}
