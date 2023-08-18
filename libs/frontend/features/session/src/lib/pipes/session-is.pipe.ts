import { Pipe, PipeTransform } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';

@Pipe({
  name: 'sessionIs'
})
export class SessionIsPipe implements PipeTransform {

  constructor(private session: SessionState) { }

  transform(serials?: string | string[] | null): boolean {
    const s = this.session.get()?.serial;

    if (!s || !serials)
      return false;

    return Array.isArray(serials)
      ? serials.includes(s)
      : s === serials;
  }

}
