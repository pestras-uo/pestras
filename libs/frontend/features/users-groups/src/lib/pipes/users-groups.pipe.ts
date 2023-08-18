import { Pipe, PipeTransform } from '@angular/core';
import { UsersGroupsState } from '@pestras/frontend/state';
import { UsersGroup } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'usersGroups'
})
export class UsersGroupsPipe implements PipeTransform {

  constructor(private state: UsersGroupsState) {}

  transform(search: string): Observable<UsersGroup[]> {
    return search 
      ? this.state.selectMany(g => g.name.includes(search))
      : this.state.data$;
  }

}
