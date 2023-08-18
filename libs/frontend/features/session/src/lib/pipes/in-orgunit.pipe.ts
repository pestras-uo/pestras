import { Pipe, PipeTransform } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';
import { Serial } from '@pestras/shared/util';

@Pipe({
  name: 'inOrgunit'
})
export class InOrgunitPipe implements PipeTransform {

  constructor(private session: SessionState) {}

  transform(orgunit: string, extended = true): boolean {
    const uOrg = this.session.get()?.orgunit;

    if (!uOrg)
      return false

    if (orgunit === 'root')
      return Serial.isRoot(uOrg);

    return extended
      ? Serial.isBranch(orgunit, uOrg, true)
      : uOrg === orgunit;
  }

}
