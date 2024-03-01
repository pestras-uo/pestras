import { Pipe, PipeTransform } from '@angular/core';
import { SessionState, UsersState } from '@pestras/frontend/state';

@Pipe({
  name: 'isGuest'
})
export class IsGuestPipe implements PipeTransform {

  constructor(
    private session: SessionState,
    private state: UsersState
  ) { }

  transform(serial?: string | null): boolean {
    const s = serial
      ? this.state.get(serial)
      : this.session.get();

    return !!s?.is_guest;
  }

}
