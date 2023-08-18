import { Pipe, PipeTransform } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';

@Pipe({
  name: 'inGroups'
})
export class InGroupsPipe implements PipeTransform {

  constructor(private session: SessionState) {}

  transform(groups: string | string[]): boolean {
    const uGroups = this.session.get()?.groups;

    if (!uGroups)
      return false;

    return Array.isArray(groups)
      ? groups.some(g => uGroups.includes(g))
      : uGroups.includes(groups);
  }

}
